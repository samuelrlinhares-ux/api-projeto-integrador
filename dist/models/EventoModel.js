"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventoModel = void 0;
const database_1 = require("../config/database");
exports.EventoModel = {
    async listarPorEmpresa(cnpj) {
        const [linhas] = await database_1.banco.query('SELECT id, conta_id, cnpj, titulo, DATE_FORMAT(data_evento, \'%Y-%m-%d\') AS data FROM eventos WHERE cnpj = ? ORDER BY data_evento, id', [cnpj]);
        return linhas;
    },
    async criar(contaId, cnpj, titulo, data) {
        const [resultado] = await database_1.banco.execute('INSERT INTO eventos (conta_id, cnpj, titulo, data_evento) VALUES (?, ?, ?, ?)', [contaId, cnpj, titulo, data]);
        return resultado.insertId;
    },
    async apagar(id, contaId) {
        await database_1.banco.execute('DELETE FROM eventos WHERE id = ? AND conta_id = ?', [id, contaId]);
    }
};
