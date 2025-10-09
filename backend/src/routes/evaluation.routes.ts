import { Router } from 'express';
import { EvaluationController } from '../controllers/evaluation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const evaluationController = new EvaluationController();

router.use(authMiddleware);

router.get('/', (req, res) => evaluationController.list(req, res));
router.get('/:id', (req, res) => evaluationController.getById(req, res));
router.post('/', (req, res) => evaluationController.create(req, res));
router.put('/:id', (req, res) => evaluationController.update(req, res));
router.delete('/:id', (req, res) => evaluationController.delete(req, res));

export default router;

