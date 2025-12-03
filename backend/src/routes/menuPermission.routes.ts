import { Router } from 'express';
import { MenuPermissionController } from '../controllers/menuPermission.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new MenuPermissionController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas
router.get('/', controller.getAll.bind(controller));
router.get('/user/me', controller.getMyMenu.bind(controller));
router.get('/:nivelAcesso', controller.getByNivelAcesso.bind(controller));
router.post('/', controller.createOrUpdate.bind(controller));
router.post('/toggle', controller.toggle.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;

