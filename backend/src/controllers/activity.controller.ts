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

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { title, description, duration, bnccCodeId, classId } = req.body;

    if (!title || !description || !duration) {
      return ApiResponse.badRequest(res, 'Título, descrição e duração são obrigatórios');
    }

    // Se não passar bnccCodeId, usa o primeiro disponível (padrão)
    let finalBnccCodeId = bnccCodeId;
    if (!finalBnccCodeId) {
      const firstBnccCode = await prisma.bNCCCode.findFirst();
      if (!firstBnccCode) {
        return ApiResponse.badRequest(res, 'Nenhum código BNCC disponível no sistema');
      }
      finalBnccCodeId = firstBnccCode.id;
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        duration: Number(duration),
        objectives: '[]',
        materials: '[]',
        bnccCodeId: Number(finalBnccCodeId),
        classId: classId ? Number(classId) : null,
      },
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
      }
    });

    return ApiResponse.created(res, activity, 'Atividade criada com sucesso');
  } catch (error: any) {
    console.error('Erro ao criar atividade:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, duration, bnccCodeId, classId } = req.body;

    const existingActivity = await prisma.activity.findUnique({
      where: { id: Number(id) }
    });

    if (!existingActivity) {
      return ApiResponse.notFound(res, 'Atividade não encontrada');
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (duration) updateData.duration = Number(duration);
    if (bnccCodeId) updateData.bnccCodeId = Number(bnccCodeId);
    if (classId !== undefined) updateData.classId = classId ? Number(classId) : null;

    const activity = await prisma.activity.update({
      where: { id: Number(id) },
      data: updateData,
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
      }
    });

    return ApiResponse.success(res, activity, 'Atividade atualizada com sucesso');
  } catch (error: any) {
    console.error('Erro ao atualizar atividade:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingActivity = await prisma.activity.findUnique({
      where: { id: Number(id) },
      include: {
        evaluations: true
      }
    });

    if (!existingActivity) {
      return ApiResponse.notFound(res, 'Atividade não encontrada');
    }

    // Verifica se há avaliações associadas
    if (existingActivity.evaluations.length > 0) {
      return ApiResponse.badRequest(
        res,
        `Não é possível excluir esta atividade. Ela possui ${existingActivity.evaluations.length} avaliação(ões) associada(s).`
      );
    }

    // Soft delete (marca como inativa)
    await prisma.activity.update({
      where: { id: Number(id) },
      data: { active: false }
    });

    return ApiResponse.success(res, null, 'Atividade excluída com sucesso');
  } catch (error: any) {
    console.error('Erro ao excluir atividade:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

