import { Router } from 'express';
import { SchoolController } from '../controllers/school.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const schoolController = new SchoolController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', (req, res) => schoolController.list(req, res));
router.get('/:id', (req, res) => schoolController.getById(req, res));
router.post('/', (req, res) => schoolController.create(req, res));
router.put('/:id', (req, res) => schoolController.update(req, res));
router.delete('/:id', (req, res) => schoolController.delete(req, res));

export default router;

