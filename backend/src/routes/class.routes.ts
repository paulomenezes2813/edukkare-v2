import { Router } from 'express';
import { ClassController } from '../controllers/class.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const classController = new ClassController();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

router.get('/', (req, res) => classController.list(req, res));
router.get('/:id', (req, res) => classController.getById(req, res));
router.post('/', (req, res) => classController.create(req, res));
router.put('/:id', (req, res) => classController.update(req, res));
router.delete('/:id', (req, res) => classController.delete(req, res));

export default router;
