"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaController = void 0;
const ContaModel_1 = require("../models/ContaModel");
const AvaliacaoModel_1 = require("../models/AvaliacaoModel");
exports.EmpresaController = {
    async painel(req, res) { const usuario = req.usuario; res.json({ funcionarios: await ContaModel_1.ContaModel.funcionariosDaEmpresa(usuario.cnpj), avaliacoes: await AvaliacaoModel_1.AvaliacaoModel.daEmpresa(usuario.cnpj) }); }
};
