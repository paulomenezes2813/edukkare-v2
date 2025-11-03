import { Router } from 'express';
import { AvatarController } from '../controllers/avatar.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const avatarController = new AvatarController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', (req, res) => avatarController.list(req, res));

export default router;

