"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContaModel = void 0;
const database_1 = require("../config/database");
exports.ContaModel = {
    async buscarPorLogin(usuario, senhaHash) {
        const [linhas] = await database_1.banco.query('SELECT id, nome, usuario, tipo, cnpj, senha_hash FROM contas WHERE usuario = ? AND senha_hash = ?', [usuario, senhaHash]);
        return linhas[0];
    },
    async criar(dados) {
        const [resultado] = await database_1.banco.execute('INSERT INTO contas (nome, usuario, senha_hash, tipo, cnpj, ip_cadastro) VALUES (?, ?, ?, ?, ?, ?)', [dados.nome, dados.usuario, dados.senhaHash, dados.tipo, dados.cnpj, dados.ip]);
        return resultado.insertId;
    },
    async existeIp(ip) {
        const [linhas] = await database_1.banco.query('SELECT id FROM contas WHERE ip_cadastro = ?', [ip]);
        return linhas.length > 0;
    },
    async funcionariosDaEmpresa(cnpj) {
        const [linhas] = await database_1.banco.query("SELECT id, nome, usuario, tipo FROM contas WHERE cnpj = ? AND tipo = 'funcionario' ORDER BY nome", [cnpj]);
        return linhas;
    }
};
