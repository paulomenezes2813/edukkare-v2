import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

export class TeacherController {
  async list(req: AuthRequest, res: Response) {
    try {
      const { active } = req.query;

      const where: any = {};
      if (active !== undefined) where.active = active === 'true';

      const teachers = await prisma.teacher.findMany({
        where,
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

      const teacher = await prisma.teacher.findUnique({
        where: { id: Number(id) },
      });

      if (!teacher) {
        return ApiResponse.notFound(res, 'Professor não encontrado');
      }

      return ApiResponse.success(res, teacher);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email, phone, specialization } = req.body;

      // Validação básica
      if (!name || !email) {
        return ApiResponse.badRequest(res, 'Nome e email são obrigatórios');
      }

      // Verifica se email já existe
      const existingTeacher = await prisma.teacher.findUnique({
        where: { email },
      });

      if (existingTeacher) {
        return ApiResponse.badRequest(res, 'Email já cadastrado');
      }

      const teacher = await prisma.teacher.create({
        data: {
          name,
          email,
          phone,
          specialization,
        },
      });

      return ApiResponse.created(res, teacher, 'Professor cadastrado com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, phone, specialization, active } = req.body;

      // Verifica se professor existe
      const existingTeacher = await prisma.teacher.findUnique({
        where: { id: Number(id) },
      });

      if (!existingTeacher) {
        return ApiResponse.notFound(res, 'Professor não encontrado');
      }

      // Se está alterando email, verifica se já existe
      if (email && email !== existingTeacher.email) {
        const emailExists = await prisma.teacher.findUnique({
          where: { email },
        });

        if (emailExists) {
          return ApiResponse.badRequest(res, 'Email já cadastrado');
        }
      }

      const teacher = await prisma.teacher.update({
        where: { id: Number(id) },
        data: {
          name,
          email,
          phone,
          specialization,
          active,
        },
      });

      return ApiResponse.success(res, teacher, 'Professor atualizado com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verifica se professor existe
      const existingTeacher = await prisma.teacher.findUnique({
        where: { id: Number(id) },
      });

      if (!existingTeacher) {
        return ApiResponse.notFound(res, 'Professor não encontrado');
      }

      await prisma.teacher.delete({
        where: { id: Number(id) },
      });

      return ApiResponse.success(res, null, 'Professor removido com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }
}
