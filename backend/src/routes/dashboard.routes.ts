import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const dashboardController = new DashboardController();

router.use(authMiddleware);

router.get('/metrics', (req, res) => dashboardController.getMetrics(req, res));
router.get('/evolution', (req, res) => dashboardController.getEvolutionChart(req, res));
router.get('/student/:studentId', (req, res) => dashboardController.getStudentProgress(req, res));

export default router;

