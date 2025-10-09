import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';

export const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await prisma.activity.findMany({
      where: { active: true },
      include: {
        bnccCode: {
          select: {
            code: true,
            name: true,
            field: true
          }
        },
        class: {
          select: {
            name: true,
            age_group: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return ApiResponse.success(res, activities);
  } catch (error: any) {
    console.error('Erro ao buscar atividades:', error);
    return ApiResponse.serverError(res);
  }
};

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const activity = await prisma.activity.findUnique({
      where: { id: Number(id) },
      include: {
        bnccCode: true,
        class: {
          include: {
            students: true
          }
        }
      }
    });

    if (!activity) {
      return ApiResponse.notFound(res, 'Atividade não encontrada');
    }

    return ApiResponse.success(res, activity);
  } catch (error: any) {
    console.error('Erro ao buscar atividade:', error);
    return ApiResponse.serverError(res);
  }
};

