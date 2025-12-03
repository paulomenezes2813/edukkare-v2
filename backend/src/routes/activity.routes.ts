import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { documentUpload } from '../middlewares/documentUpload.middleware';
import { 
  getActivities, 
  getActivityById, 
  createActivity, 
  updateActivity, 
  deleteActivity,
  uploadDocumentation,
  getActivityDocuments,
  deleteActivityDocument
} from '../controllers/activity.controller';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', getActivities);
router.get('/:id', getActivityById);
router.get('/:id/documents', getActivityDocuments);
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.post('/:id/documentation', documentUpload.single('document'), uploadDocumentation);
router.delete('/:id', deleteActivity);
router.delete('/:id/documents/:documentId', deleteActivityDocument);

export default router;

