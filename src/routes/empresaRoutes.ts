import { Router } from 'express';
import { AvaliacaoController } from '../controllers/AvaliacaoController';
import { EmpresaController } from '../controllers/EmpresaController';
import { autenticar, somenteGestor } from '../middlewares/auth';

const router = Router();
router.post('/avaliacoes', autenticar, AvaliacaoController.criar);
router.get('/resultados', autenticar, AvaliacaoController.minhas);
router.get('/empresa', autenticar, somenteGestor, EmpresaController.painel);
export default router;
