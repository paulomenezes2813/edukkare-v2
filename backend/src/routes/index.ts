import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import activityRoutes from './activity.routes';
import evaluationRoutes from './evaluation.routes';
import evidenceRoutes from './evidence.routes';
import dashboardRoutes from './dashboard.routes';
import teacherRoutes from './teacher.routes';
import schoolRoutes from './school.routes';
import avatarRoutes from './avatar.routes';
import classRoutes from './class.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/activities', activityRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/evidences', evidenceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/teachers', teacherRoutes);
router.use('/schools', schoolRoutes);
router.use('/avatars', avatarRoutes);
router.use('/classes', classRoutes);
router.use('/users', userRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'EDUKKARE API',
  });
});

export default router;

