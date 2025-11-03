import { Router } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// Listar todos os avatares
router.get('/', async (req, res) => {
  try {
    const avatars = await prisma.avatar.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return ApiResponse.success(res, avatars);
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

export default router;
