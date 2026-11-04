"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessoes = void 0;
exports.autenticar = autenticar;
exports.somenteGestor = somenteGestor;
exports.sessoes = new Map();
function autenticar(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const usuario = token ? exports.sessoes.get(token) : undefined;
    if (!usuario)
        return res.status(401).json({ erro: 'Faça login para continuar.' });
    req.usuario = usuario;
    next();
}
function somenteGestor(req, res, next) {
    const usuario = req.usuario;
    if (!usuario || !['dono', 'gerente'].includes(usuario.tipo))
        return res.status(403).json({ erro: 'Apenas dono e gerente têm acesso.' });
    next();
}
