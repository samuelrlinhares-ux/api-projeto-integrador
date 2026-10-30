"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotaController = void 0;
const NotaModel_1 = require("../models/NotaModel");
exports.NotaController = {
    async listar(req, res) { res.json(await NotaModel_1.NotaModel.listar(req.usuario.id)); },
    async criar(req, res) { const id = await NotaModel_1.NotaModel.criar(req.usuario.id, req.body.titulo, req.body.texto); res.status(201).json({ id }); },
    async apagar(req, res) { await NotaModel_1.NotaModel.apagar(Number(req.params.id), req.usuario.id); res.json({ ok: true }); }
};
