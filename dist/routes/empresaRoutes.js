"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AvaliacaoController_1 = require("../controllers/AvaliacaoController");
const EmpresaController_1 = require("../controllers/EmpresaController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Criar uma avaliação
router.post('/avaliacoes', auth_1.autenticar, AvaliacaoController_1.AvaliacaoController.criar);
// Buscar as avaliações do funcionário logado
router.get('/resultados', auth_1.autenticar, AvaliacaoController_1.AvaliacaoController.minhas);
// Remover somente o comentário da própria avaliação
router.delete('/avaliacoes/:id/comentario', auth_1.autenticar, AvaliacaoController_1.AvaliacaoController.removerComentario);
// Painel da empresa, somente para dono e gerente
router.get('/empresa', auth_1.autenticar, auth_1.somenteGestor, EmpresaController_1.EmpresaController.painel);
exports.default = router;
