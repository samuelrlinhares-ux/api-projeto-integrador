import { Request, Response } from 'express';
import crypto from 'crypto';
import { ContaModel } from '../models/ContaModel';
import { sessoes } from '../middlewares/auth';

const hash = (texto: string) => crypto.createHash('sha256').update(texto).digest('hex');
const ipDoUsuario = (req: Request) => String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

export const AuthController = {
  async cadastro(req: Request, res: Response) {
    try {
      const { nome, usuario, senha, tipo, cnpj } = req.body;
      const ip = ipDoUsuario(req);
      const numeroCnpj = String(cnpj || '').replace(/\D/g, '');
      if (!nome || !usuario || !senha || !tipo || !numeroCnpj || !['funcionario', 'gerente', 'dono'].includes(tipo)) return res.status(400).json({ erro: 'Preencha todos os dados.' });
      if (numeroCnpj.length !== 14) return res.status(400).json({ erro: 'O CNPJ precisa ter 14 números.' });
      const id = await ContaModel.criar({ nome: nome.trim(), usuario: usuario.trim().toLowerCase(), senhaHash: hash(senha), tipo, cnpj: numeroCnpj, ip });
      res.status(201).json({ id, mensagem: 'Conta criada com sucesso.' });
    } catch (erro: any) {
      console.error('ERRO NO CADASTRO:', erro);
      if (erro.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Usuário ou IP já cadastrado. Verifique a tabela contas no DBeaver.' });
      if (erro.code === 'ER_NO_SUCH_TABLE') return res.status(500).json({ erro: 'A tabela contas não existe no banco selecionado.' });
      if (erro.code === 'ER_BAD_FIELD_ERROR') return res.status(500).json({ erro: `A tabela contas está diferente do projeto: ${erro.sqlMessage}` });
      if (erro.code === 'ECONNREFUSED' || erro.code === 'PROTOCOL_CONNECTION_LOST') return res.status(500).json({ erro: 'O MySQL não está ligado ou a conexão está incorreta.' });
      res.status(500).json({ erro: `Erro do banco: ${erro.sqlMessage || erro.message || erro.code}` });
    }
  },
  async login(req: Request, res: Response) {
    const conta = await ContaModel.buscarPorLogin(req.body.usuario?.trim().toLowerCase(), hash(req.body.senha || ''));
    if (!conta) return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
    const token = crypto.randomBytes(24).toString('hex');
    const usuario = { id: conta.id, nome: conta.nome, usuario: conta.usuario, tipo: conta.tipo, cnpj: conta.cnpj };
    sessoes.set(token, usuario);
    res.json({ token, usuario });
  },
  logout(req: Request, res: Response) { const token = req.headers.authorization?.replace('Bearer ', ''); if (token) sessoes.delete(token); res.json({ ok: true }); }
};
