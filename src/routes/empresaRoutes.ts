import { Router } from 'express';
import { AvaliacaoController } from '../controllers/AvaliacaoController';
import { EmpresaController } from '../controllers/EmpresaController';
import {
  autenticar,
  somenteGestor
} from '../middlewares/auth';

const router = Router();

// Criar uma avaliação
router.post(
  '/avaliacoes',
  autenticar,
  AvaliacaoController.criar
);

// Buscar as avaliações do funcionário logado
router.get(
  '/resultados',
  autenticar,
  AvaliacaoController.minhas
);

// Remover somente o comentário da própria avaliação
router.delete(
  '/avaliacoes/:id/comentario',
  autenticar,
  AvaliacaoController.removerComentario
);

// Painel da empresa, somente para dono e gerente
router.get(
  '/empresa',
  autenticar,
  somenteGestor,
  EmpresaController.painel
);

export default router;
