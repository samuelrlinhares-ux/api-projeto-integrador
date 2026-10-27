"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvaliacaoController = void 0;
const AvaliacaoModel_1 = require("../models/AvaliacaoModel");
exports.AvaliacaoController = {
    async criar(req, res) {
        try {
            const usuario = req.usuario;
            const mes = new Date().toISOString().slice(0, 7);
            const id = await AvaliacaoModel_1.AvaliacaoModel.criar({ contaId: usuario.id, cnpj: usuario.cnpj, humor: req.body.humor, nota: Number(req.body.nota), comentario: req.body.comentario || '', anonimo: Boolean(req.body.anonimo), mes });
            res.status(201).json({ id, mensagem: 'Avaliação salva.' });
        }
        catch (erro) {
            res.status(409).json({ erro: erro.code === 'ER_DUP_ENTRY' ? 'Você já fez uma avaliação neste mês.' : 'Não foi possível salvar a avaliação.' });
        }
    },
    async minhas(req, res) { const usuario = req.usuario; res.json(await AvaliacaoModel_1.AvaliacaoModel.daConta(usuario.id)); }
};
