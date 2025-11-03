import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

export class SchoolController {
  async list(req: AuthRequest, res: Response) {
    try {
      const { active } = req.query;

      const where: any = {};
      if (active !== undefined) where.active = active === 'true';

      const schools = await prisma.school.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponse.success(res, schools);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const school = await prisma.school.findUnique({
        where: { id: Number(id) },
      });

      if (!school) {
        return ApiResponse.notFound(res, 'Escola não encontrada');
      }

      return ApiResponse.success(res, school);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, address, phone, email } = req.body;

      // Validação básica
      if (!name) {
        return ApiResponse.badRequest(res, 'Nome é obrigatório');
      }

      const school = await prisma.school.create({
        data: {
          name,
          address,
          phone,
          email,
        },
      });

      return ApiResponse.created(res, school, 'Escola cadastrada com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, address, phone, email, active } = req.body;

      // Verifica se escola existe
      const existingSchool = await prisma.school.findUnique({
        where: { id: Number(id) },
      });

      if (!existingSchool) {
        return ApiResponse.notFound(res, 'Escola não encontrada');
      }

      const school = await prisma.school.update({
        where: { id: Number(id) },
        data: {
          name,
          address,
          phone,
          email,
          active,
        },
      });

      return ApiResponse.success(res, school, 'Escola atualizada com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verifica se escola existe
      const existingSchool = await prisma.school.findUnique({
        where: { id: Number(id) },
      });

      if (!existingSchool) {
        return ApiResponse.notFound(res, 'Escola não encontrada');
      }

      await prisma.school.delete({
        where: { id: Number(id) },
      });

      return ApiResponse.success(res, null, 'Escola removida com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }
}
