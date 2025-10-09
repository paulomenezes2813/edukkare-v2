import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

export class EvaluationController {
  async list(req: AuthRequest, res: Response) {
    try {
      const { studentId, activityId, teacherId, startDate, endDate } = req.query;

      const where: any = {};

      if (studentId) where.studentId = Number(studentId);
      if (activityId) where.activityId = Number(activityId);
      if (teacherId) where.teacherId = Number(teacherId);
      
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate as string);
        if (endDate) where.date.lte = new Date(endDate as string);
      }

      const evaluations = await prisma.evaluation.findMany({
        where,
        include: {
          student: true,
          activity: {
            include: {
              bnccCode: true,
            },
          },
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
          evidences: true,
        },
        orderBy: {
          date: 'desc',
        },
      });

      return ApiResponse.success(res, evaluations);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const evaluation = await prisma.evaluation.findUnique({
        where: { id: Number(id) },
        include: {
          student: true,
          activity: {
            include: {
              bnccCode: true,
            },
          },
          bnccCode: true,
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
          evidences: true,
        },
      });

      if (!evaluation) {
        return ApiResponse.notFound(res, 'Avaliação não encontrada');
      }

      return ApiResponse.success(res, evaluation);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { studentId, activityId, bnccCodeId, level, percentage, observations } = req.body;

      const evaluation = await prisma.evaluation.create({
        data: {
          studentId: Number(studentId),
          activityId: Number(activityId),
          bnccCodeId: Number(bnccCodeId),
          teacherId: req.user!.id,
          level,
          percentage: Number(percentage),
          observations,
        },
        include: {
          student: true,
          activity: {
            include: {
              bnccCode: true,
            },
          },
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return ApiResponse.created(res, evaluation, 'Avaliação registrada com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { level, percentage, observations } = req.body;

      const evaluation = await prisma.evaluation.update({
        where: { id: Number(id) },
        data: {
          level,
          percentage: percentage ? Number(percentage) : undefined,
          observations,
        },
        include: {
          student: true,
          activity: {
            include: {
              bnccCode: true,
            },
          },
        },
      });

      return ApiResponse.success(res, evaluation, 'Avaliação atualizada com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.evaluation.delete({
        where: { id: Number(id) },
      });

      return ApiResponse.success(res, null, 'Avaliação removida com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }
}

