import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const studentController = new StudentController();

router.use(authMiddleware);

router.get('/', (req, res) => studentController.list(req, res));
router.get('/:id', (req, res) => studentController.getById(req, res));
router.post('/', (req, res) => studentController.create(req, res));
router.put('/:id', (req, res) => studentController.update(req, res));
router.delete('/:id', (req, res) => studentController.delete(req, res));

export default router;

