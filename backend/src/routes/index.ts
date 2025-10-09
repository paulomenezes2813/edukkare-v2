import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import activityRoutes from './activity.routes';
import evaluationRoutes from './evaluation.routes';
import evidenceRoutes from './evidence.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/activities', activityRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/evidences', evidenceRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'EDUKKARE API',
  });
});

export default router;

