import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { autenticar } from '../middlewares/auth';

const router = Router();
router.post('/cadastro', AuthController.cadastro);
router.post('/login', AuthController.login);
router.post('/logout', autenticar, AuthController.logout);
export default router;
