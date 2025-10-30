import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getActivities, getActivityById } from '../controllers/activity.controller';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', getActivities);
router.get('/:id', getActivityById);

export default router;

