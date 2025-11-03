import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { 
  getActivities, 
  getActivityById, 
  createActivity, 
  updateActivity, 
  deleteActivity 
} from '../controllers/activity.controller';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', getActivities);
router.get('/:id', getActivityById);
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;

