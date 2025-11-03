import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

export class StudentController {
  async list(req: AuthRequest, res: Response) {
    try {
      const { classId, shift, active } = req.query;

      const where: any = {};

      if (classId) where.classId = Number(classId);
      if (shift) where.shift = shift;
      if (active !== undefined) where.active = active === 'true';

      const students = await prisma.student.findMany({
        where,
        include: {
          class: {
            include: {
              teacher: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          avatar: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponse.success(res, students);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const student = await prisma.student.findUnique({
        where: { id: Number(id) },
        include: {
          class: true,
          avatar: true,
          evaluations: {
            include: {
              activity: true,
              bnccCode: true,
            },
            orderBy: {
              date: 'desc',
            },
          },
          evidences: {
            orderBy: {
              createdAt: 'desc',
            },
          },
          aiInsights: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!student) {
        return ApiResponse.notFound(res, 'Aluno não encontrado');
      }

      return ApiResponse.success(res, student);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, birthDate, responsavel, telefone, email, shift, classId } = req.body;

      const student = await prisma.student.create({
        data: {
          name,
          birthDate: new Date(birthDate),
          responsavel,
          telefone,
          email,
          shift,
          classId: Number(classId),
        },
        include: {
          class: true,
          avatar: true,
        },
      });

      return ApiResponse.created(res, student, 'Aluno cadastrado com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, birthDate, responsavel, telefone, email, shift, classId, active } = req.body;

      const student = await prisma.student.update({
        where: { id: Number(id) },
        data: {
          name,
          birthDate: birthDate ? new Date(birthDate) : undefined,
          responsavel,
          telefone,
          email,
          shift,
          classId: classId ? Number(classId) : undefined,
          active,
        },
        include: {
          class: true,
          avatar: true,
        },
      });

      return ApiResponse.success(res, student, 'Aluno atualizado com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.student.delete({
        where: { id: Number(id) },
      });

      return ApiResponse.success(res, null, 'Aluno removido com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }
}

