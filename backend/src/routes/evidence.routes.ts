import { Router } from 'express';
import { EvidenceController } from '../controllers/evidence.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();
const evidenceController = new EvidenceController();

router.use(authMiddleware);

router.get('/', (req, res) => evidenceController.list(req, res));
router.get('/:id', (req, res) => evidenceController.getById(req, res));
router.post('/upload', upload.single('file'), (req, res) => evidenceController.upload(req, res));
router.delete('/:id', (req, res) => evidenceController.delete(req, res));

export default router;

