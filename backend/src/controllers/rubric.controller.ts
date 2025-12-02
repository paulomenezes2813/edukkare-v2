import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';

export const getRubrics = async (req: Request, res: Response) => {
  try {
    const { activityId, activityCode } = req.query;
    
    const where: any = { active: true };
    
    if (activityId) {
      where.activityId = parseInt(activityId as string);
    }
    
    if (activityCode) {
      where.activityCode = activityCode as string;
    }

    const rubrics = await prisma.rubric.findMany({
      where,
      include: {
        activity: {
          select: {
            id: true,
            activityCode: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse JSON fields
    const parsedRubrics = rubrics.map(rubric => ({
      ...rubric,
      levels: JSON.parse(rubric.levels)
    }));

    return ApiResponse.success(res, parsedRubrics);
  } catch (error: any) {
    console.error('Erro ao buscar rubricas:', error);
    return ApiResponse.serverError(res);
  }
};

export const getRubricById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rubric = await prisma.rubric.findUnique({
      where: { id: parseInt(id) },
      include: {
        activity: {
          select: {
            id: true,
            activityCode: true,
            title: true
          }
        }
      }
    });

    if (!rubric) {
      return ApiResponse.notFound(res, 'Rubrica não encontrada');
    }

    // Parse JSON field
    const parsedRubric = {
      ...rubric,
      levels: JSON.parse(rubric.levels)
    };

    return ApiResponse.success(res, parsedRubric);
  } catch (error: any) {
    console.error('Erro ao buscar rubrica:', error);
    return ApiResponse.serverError(res);
  }
};

export const createRubric = async (req: Request, res: Response) => {
  try {
    const { rubricCode, name, description, activityCode, activityId, levels, criteria } = req.body;

    // Validações
    if (!rubricCode || !name || !description || !activityCode || !activityId || !levels) {
      return ApiResponse.badRequest(res, 'Campos obrigatórios faltando');
    }

    // Verifica se a atividade existe
    const activity = await prisma.activity.findUnique({
      where: { id: activityId }
    });

    if (!activity) {
      return ApiResponse.notFound(res, 'Atividade não encontrada');
    }

    // Verifica se o código da rubrica já existe
    const existingRubric = await prisma.rubric.findUnique({
      where: { rubricCode }
    });

    if (existingRubric) {
      return ApiResponse.badRequest(res, 'Código de rubrica já existe');
    }

    // Stringify levels se for objeto
    const levelsString = typeof levels === 'string' ? levels : JSON.stringify(levels);

    const rubric = await prisma.rubric.create({
      data: {
        rubricCode,
        name,
        description,
        activityCode,
        activityId,
        levels: levelsString,
        criteria: criteria || null
      },
      include: {
        activity: {
          select: {
            id: true,
            activityCode: true,
            title: true
          }
        }
      }
    });

    // Parse JSON field
    const parsedRubric = {
      ...rubric,
      levels: JSON.parse(rubric.levels)
    };

    return ApiResponse.created(res, parsedRubric);
  } catch (error: any) {
    console.error('Erro ao criar rubrica:', error);
    return ApiResponse.serverError(res);
  }
};

export const updateRubric = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rubricCode, name, description, activityCode, activityId, levels, criteria, active } = req.body;

    const rubric = await prisma.rubric.findUnique({
      where: { id: parseInt(id) }
    });

    if (!rubric) {
      return ApiResponse.notFound(res, 'Rubrica não encontrada');
    }

    // Se está atualizando o código, verifica se já existe
    if (rubricCode && rubricCode !== rubric.rubricCode) {
      const existingRubric = await prisma.rubric.findUnique({
        where: { rubricCode }
      });

      if (existingRubric) {
        return ApiResponse.badRequest(res, 'Código de rubrica já existe');
      }
    }

    // Se está atualizando a atividade, verifica se existe
    if (activityId && activityId !== rubric.activityId) {
      const activity = await prisma.activity.findUnique({
        where: { id: activityId }
      });

      if (!activity) {
        return ApiResponse.notFound(res, 'Atividade não encontrada');
      }
    }

    // Stringify levels se for objeto
    const levelsString = levels ? (typeof levels === 'string' ? levels : JSON.stringify(levels)) : undefined;

    const updatedRubric = await prisma.rubric.update({
      where: { id: parseInt(id) },
      data: {
        rubricCode: rubricCode || undefined,
        name: name || undefined,
        description: description || undefined,
        activityCode: activityCode || undefined,
        activityId: activityId || undefined,
        levels: levelsString,
        criteria: criteria !== undefined ? criteria : undefined,
        active: active !== undefined ? active : undefined
      },
      include: {
        activity: {
          select: {
            id: true,
            activityCode: true,
            title: true
          }
        }
      }
    });

    // Parse JSON field
    const parsedRubric = {
      ...updatedRubric,
      levels: JSON.parse(updatedRubric.levels)
    };

    return ApiResponse.success(res, parsedRubric);
  } catch (error: any) {
    console.error('Erro ao atualizar rubrica:', error);
    return ApiResponse.serverError(res);
  }
};

export const deleteRubric = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rubric = await prisma.rubric.findUnique({
      where: { id: parseInt(id) }
    });

    if (!rubric) {
      return ApiResponse.notFound(res, 'Rubrica não encontrada');
    }

    // Soft delete
    await prisma.rubric.update({
      where: { id: parseInt(id) },
      data: { active: false }
    });

    return ApiResponse.success(res, { message: 'Rubrica excluída com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir rubrica:', error);
    return ApiResponse.serverError(res);
  }
};

