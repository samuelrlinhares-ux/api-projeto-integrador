import { Router } from 'express';
import { NotaController } from '../controllers/NotaController';
import { autenticar } from '../middlewares/auth';

const router = Router();
router.get('/notas', autenticar, NotaController.listar);
router.post('/notas', autenticar, NotaController.criar);
router.delete('/notas/:id', autenticar, NotaController.apagar);
export default router;
