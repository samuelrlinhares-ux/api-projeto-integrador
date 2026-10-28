"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvaliacaoModel = void 0;
const database_1 = require("../config/database");
exports.AvaliacaoModel = {
    async criar(dados) {
        const [resultado] = await database_1.banco.execute('INSERT INTO avaliacoes (conta_id, cnpj, humor, nota, comentario, anonimo, mes_avaliacao, data_avaliacao) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())', [dados.contaId, dados.cnpj, dados.humor, dados.nota, dados.comentario, dados.anonimo, dados.mes]);
        return resultado.insertId;
    },
    async daConta(contaId) {
        const [linhas] = await database_1.banco.query("SELECT id, conta_id, cnpj, humor, nota, comentario, anonimo, mes_avaliacao, DATE_FORMAT(data_avaliacao, '%d/%m/%Y') AS data FROM avaliacoes WHERE conta_id = ? ORDER BY id DESC", [contaId]);
        return linhas;
    },
    async daEmpresa(cnpj) {
        const [linhas] = await database_1.banco.query("SELECT a.id, a.conta_id, a.cnpj, a.humor, a.nota, a.comentario, a.anonimo, DATE_FORMAT(a.data_avaliacao, '%d/%m/%Y') AS data, c.nome FROM avaliacoes a JOIN contas c ON c.id = a.conta_id WHERE a.cnpj = ? ORDER BY a.id DESC", [cnpj]);
        return linhas;
    }
};
