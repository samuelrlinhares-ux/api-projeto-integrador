"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ContaModel_1 = require("../models/ContaModel");
const auth_1 = require("../middlewares/auth");
const hash = (texto) => crypto_1.default.createHash('sha256').update(texto).digest('hex');
const ipDoUsuario = (req) => String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
exports.AuthController = {
    async cadastro(req, res) {
        try {
            const { nome, usuario, senha, tipo, cnpj } = req.body;
            const ip = ipDoUsuario(req);
            const numeroCnpj = String(cnpj || '').replace(/\D/g, '');
            if (!nome || !usuario || !senha || !tipo || !numeroCnpj || !['funcionario', 'gerente', 'dono'].includes(tipo))
                return res.status(400).json({ erro: 'Preencha todos os dados.' });
            if (numeroCnpj.length !== 14)
                return res.status(400).json({ erro: 'O CNPJ precisa ter 14 números.' });
            const id = await ContaModel_1.ContaModel.criar({ nome: nome.trim(), usuario: usuario.trim().toLowerCase(), senhaHash: hash(senha), tipo, cnpj: numeroCnpj, ip });
            res.status(201).json({ id, mensagem: 'Conta criada com sucesso.' });
        }
        catch (erro) {
            console.error('ERRO NO CADASTRO:', erro);
            if (erro.code === 'ER_DUP_ENTRY')
                return res.status(409).json({ erro: 'Usuário ou IP já cadastrado. Verifique a tabela contas no DBeaver.' });
            if (erro.code === 'ER_NO_SUCH_TABLE')
                return res.status(500).json({ erro: 'A tabela contas não existe no banco selecionado.' });
            if (erro.code === 'ER_BAD_FIELD_ERROR')
                return res.status(500).json({ erro: `A tabela contas está diferente do projeto: ${erro.sqlMessage}` });
            if (erro.code === 'ECONNREFUSED' || erro.code === 'PROTOCOL_CONNECTION_LOST')
                return res.status(500).json({ erro: 'O MySQL não está ligado ou a conexão está incorreta.' });
            res.status(500).json({ erro: `Erro do banco: ${erro.sqlMessage || erro.message || erro.code}` });
        }
    },
    async login(req, res) {
        const conta = await ContaModel_1.ContaModel.buscarPorLogin(req.body.usuario?.trim().toLowerCase(), hash(req.body.senha || ''));
        if (!conta)
            return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
        const token = crypto_1.default.randomBytes(24).toString('hex');
        const usuario = { id: conta.id, nome: conta.nome, usuario: conta.usuario, tipo: conta.tipo, cnpj: conta.cnpj };
        auth_1.sessoes.set(token, usuario);
        res.json({ token, usuario });
    },
    logout(req, res) { const token = req.headers.authorization?.replace('Bearer ', ''); if (token)
        auth_1.sessoes.delete(token); res.json({ ok: true }); }
};
