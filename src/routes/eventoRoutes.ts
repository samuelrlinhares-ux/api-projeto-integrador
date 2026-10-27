import { Router } from 'express';
import { EventoController } from '../controllers/EventoController';
import { autenticar, somenteGestor } from '../middlewares/auth';

const router = Router();
router.get('/eventos', autenticar, EventoController.listar);
router.post('/eventos', autenticar, somenteGestor, EventoController.criar);
router.delete('/eventos/:id', autenticar, somenteGestor, EventoController.apagar);
export default router;
