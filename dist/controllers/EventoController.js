"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventoController = void 0;
const EventoModel_1 = require("../models/EventoModel");
exports.EventoController = {
    async listar(req, res) { const usuario = req.usuario; res.json(await EventoModel_1.EventoModel.listarPorEmpresa(usuario.cnpj)); },
    async criar(req, res) { const usuario = req.usuario; const id = await EventoModel_1.EventoModel.criar(usuario.id, usuario.cnpj, req.body.titulo, req.body.data); res.status(201).json({ id }); },
    async apagar(req, res) { const usuario = req.usuario; await EventoModel_1.EventoModel.apagar(Number(req.params.id), usuario.id); res.json({ ok: true }); }
};
