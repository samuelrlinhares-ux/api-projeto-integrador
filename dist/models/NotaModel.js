"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotaModel = void 0;
const database_1 = require("../config/database");
exports.NotaModel = {
    async listar(contaId) { const [linhas] = await database_1.banco.query("SELECT id, conta_id, titulo, texto, DATE_FORMAT(data_criacao, '%d/%m/%Y') AS data FROM notas WHERE conta_id = ? ORDER BY id DESC", [contaId]); return linhas; },
    async criar(contaId, titulo, texto) { const [resultado] = await database_1.banco.execute('INSERT INTO notas (conta_id, titulo, texto, data_criacao) VALUES (?, ?, ?, CURDATE())', [contaId, titulo, texto]); return resultado.insertId; },
    async apagar(id, contaId) { await database_1.banco.execute('DELETE FROM notas WHERE id = ? AND conta_id = ?', [id, contaId]); }
};
