import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const teacherController = new TeacherController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', (req, res) => teacherController.list(req, res));
router.get('/:id', (req, res) => teacherController.getById(req, res));
router.put('/:id', (req, res) => teacherController.update(req, res));

export default router;

