import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { 
  getRubrics, 
  getRubricById, 
  createRubric, 
  updateRubric, 
  deleteRubric 
} from '../controllers/rubric.controller';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', getRubrics);
router.get('/:id', getRubricById);
router.post('/', createRubric);
router.put('/:id', updateRubric);
router.delete('/:id', deleteRubric);

export default router;

