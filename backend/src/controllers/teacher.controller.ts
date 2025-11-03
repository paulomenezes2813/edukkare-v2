import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

export class TeacherController {
  async list(req: AuthRequest, res: Response) {
    try {
      // Busca usuários com role PROFESSOR
      const teachers = await prisma.user.findMany({
        where: {
          role: 'PROFESSOR'
        },
        select: {
          id: true,
          name: true,
          email: true,
          active: true,
          createdAt: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponse.success(res, teachers);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const teacher = await prisma.user.findUnique({
        where: { 
          id: Number(id),
          role: 'PROFESSOR'
        },
        include: {
          classes: true,
        },
      });

      if (!teacher) {
        return ApiResponse.notFound(res, 'Professor não encontrado');
      }

      return ApiResponse.success(res, teacher);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, active } = req.body;

      const teacher = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          name,
          email,
          active,
        },
      });

      return ApiResponse.success(res, teacher, 'Professor atualizado com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }
}

