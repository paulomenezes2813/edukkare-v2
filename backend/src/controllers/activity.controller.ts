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
        },
        rubrics: {
          select: {
            id: true,
            rubricCode: true,
            name: true,
            description: true
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
        },
        rubrics: true
      }
    });

    if (!activity) {
      return ApiResponse.notFound(res, 'Atividade não encontrada');
    }

    // Parse JSON fields das rubricas
    const parsedActivity = {
      ...activity,
      rubrics: activity.rubrics.map(rubric => ({
        ...rubric,
        levels: JSON.parse(rubric.levels)
      }))
    };

    return ApiResponse.success(res, parsedActivity);
  } catch (error: any) {
    console.error('Erro ao buscar atividade:', error);
    return ApiResponse.serverError(res);
  }
};

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { activityCode, title, description, content, duration, bnccCodeId, classId } = req.body;

    if (!title || !description || !duration) {
      return ApiResponse.badRequest(res, 'Título, descrição e duração são obrigatórios');
    }

    // Verifica se o activityCode já existe (se fornecido)
    if (activityCode) {
      const existingActivity = await prisma.activity.findUnique({
        where: { activityCode }
      });

      if (existingActivity) {
        return ApiResponse.badRequest(res, 'Código de atividade já existe');
      }
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
        activityCode: activityCode || null,
        title,
        description,
        content: content || null,
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
        },
        rubrics: {
          select: {
            id: true,
            rubricCode: true,
            name: true,
            description: true
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

export const uploadDocumentation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return ApiResponse.badRequest(res, 'Nenhum arquivo foi enviado');
    }

    const activity = await prisma.activity.findUnique({
      where: { id: Number(id) },
    });

    if (!activity) {
      return ApiResponse.notFound(res, 'Atividade não encontrada');
    }

    // Atualiza o caminho da documentação (relativo à pasta uploads)
    const documentationPath = file.path.replace(/\\/g, '/'); // Normaliza caminho para Unix
    const updatedActivity = await prisma.activity.update({
      where: { id: Number(id) },
      data: {
        documentationPath: documentationPath,
      },
      include: {
        bnccCode: {
          select: {
            code: true,
            name: true,
            field: true
          }
        },
        rubrics: {
          select: {
            id: true,
            rubricCode: true,
            name: true,
            description: true
          }
        }
      }
    });

    return ApiResponse.success(res, updatedActivity, 'Documentação anexada com sucesso');
  } catch (error: any) {
    console.error('Erro ao fazer upload da documentação:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { activityCode, title, description, content, duration, bnccCodeId, classId } = req.body;

    const existingActivity = await prisma.activity.findUnique({
      where: { id: Number(id) }
    });

    if (!existingActivity) {
      return ApiResponse.notFound(res, 'Atividade não encontrada');
    }

    // Verifica se o activityCode já existe (se estiver sendo alterado)
    if (activityCode && activityCode !== existingActivity.activityCode) {
      const duplicateActivity = await prisma.activity.findUnique({
        where: { activityCode }
      });

      if (duplicateActivity) {
        return ApiResponse.badRequest(res, 'Código de atividade já existe');
      }
    }

    const updateData: any = {};
    if (activityCode !== undefined) updateData.activityCode = activityCode || null;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (content !== undefined) updateData.content = content || null;
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
        },
        rubrics: {
          select: {
            id: true,
            rubricCode: true,
            name: true,
            description: true
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

