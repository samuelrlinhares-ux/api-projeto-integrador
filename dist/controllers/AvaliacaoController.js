"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvaliacaoController = void 0;
const AvaliacaoModel_1 = require("../models/AvaliacaoModel");
exports.AvaliacaoController = {
    async criar(req, res) {
        try {
            const usuario = req.usuario;
            const mes = new Date().toISOString().slice(0, 7);
            const id = await AvaliacaoModel_1.AvaliacaoModel.criar({
                contaId: usuario.id,
                cnpj: usuario.cnpj,
                humor: req.body.humor,
                nota: Number(req.body.nota),
                comentario: req.body.comentario || '',
                anonimo: Boolean(req.body.anonimo),
                mes
            });
            return res.status(201).json({
                id,
                mensagem: 'Avaliação salva.'
            });
        }
        catch (erro) {
            if (erro.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    erro: 'Você já fez uma avaliação neste mês.'
                });
            }
            return res.status(500).json({
                erro: 'Não foi possível salvar a avaliação.'
            });
        }
    },
    async minhas(req, res) {
        const usuario = req.usuario;
        const avaliacoes = await AvaliacaoModel_1.AvaliacaoModel.daConta(usuario.id);
        return res.json(avaliacoes);
    },
    async removerComentario(req, res) {
        const usuario = req.usuario;
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'Avaliação inválida.'
            });
        }
        const removido = await AvaliacaoModel_1.AvaliacaoModel.removerComentario(id, usuario.id);
        if (!removido) {
            return res.status(404).json({
                erro: 'Comentário não encontrado ou não pertence a você.'
            });
        }
        return res.json({
            mensagem: 'Comentário removido. A nota da avaliação foi mantida.'
        });
    }
};
