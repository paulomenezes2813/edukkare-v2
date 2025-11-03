import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const teacherController = new TeacherController();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

router.get('/', (req, res) => teacherController.list(req, res));
router.get('/:id', (req, res) => teacherController.getById(req, res));
router.post('/', (req, res) => teacherController.create(req, res));
router.put('/:id', (req, res) => teacherController.update(req, res));
router.delete('/:id', (req, res) => teacherController.delete(req, res));

export default router;
