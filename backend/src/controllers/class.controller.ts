import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';

export class ClassController {
  async list(req: Request, res: Response) {
    try {
      const { shift, year, active } = req.query;

      const where: any = {};

      if (shift) where.shift = shift;
      if (year) where.year = Number(year);
      if (active !== undefined) where.active = active === 'true';

      const classes = await prisma.class.findMany({
        where,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          teacherProfile: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              specialization: true,
            },
          },
          students: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              students: true,
              activities: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponse.success(res, classes);
    } catch (error: any) {
      console.error('Erro ao listar turmas:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const classData = await prisma.class.findUnique({
        where: { id: Number(id) },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          students: {
            include: {
              avatar: true,
            },
          },
          activities: true,
        },
      });

      if (!classData) {
        return ApiResponse.notFound(res, 'Turma não encontrada');
      }

      return ApiResponse.success(res, classData);
    } catch (error: any) {
      console.error('Erro ao buscar turma:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, age_group, shift, year, teacherId, teacherProfileId } = req.body;

      if (!name || !age_group || !shift || !year) {
        return ApiResponse.badRequest(res, 'Nome, faixa etária, turno e ano são obrigatórios');
      }

      // Valida que pelo menos um professor foi informado
      if (!teacherId && !teacherProfileId) {
        return ApiResponse.badRequest(res, 'É necessário informar um professor responsável');
      }

      // Verifica se o professor existe (User ou Teacher)
      if (teacherId) {
        const teacher = await prisma.user.findUnique({
          where: { id: Number(teacherId) },
        });

        if (!teacher) {
          return ApiResponse.notFound(res, 'Professor (usuário) não encontrado');
        }
      }

      if (teacherProfileId) {
        const teacherProfile = await prisma.teacher.findUnique({
          where: { id: Number(teacherProfileId) },
        });

        if (!teacherProfile) {
          return ApiResponse.notFound(res, 'Professor (perfil) não encontrado');
        }
      }

      // Se teacherProfileId foi fornecido mas teacherId não, usa o primeiro user admin como fallback
      let finalTeacherId = teacherId ? Number(teacherId) : null;
      if (!finalTeacherId) {
        const adminUser = await prisma.user.findFirst({
          where: { role: 'ADMIN' },
        });
        if (adminUser) {
          finalTeacherId = adminUser.id;
        } else {
          return ApiResponse.badRequest(res, 'Nenhum usuário administrador encontrado para associar');
        }
      }

      const classData = await prisma.class.create({
        data: {
          name,
          age_group,
          shift,
          year: Number(year),
          teacherId: finalTeacherId,
          teacherProfileId: teacherProfileId ? Number(teacherProfileId) : null,
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          teacherProfile: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              specialization: true,
            },
          },
          _count: {
            select: {
              students: true,
              activities: true,
            },
          },
        },
      });

      return ApiResponse.created(res, classData, 'Turma criada com sucesso');
    } catch (error: any) {
      console.error('Erro ao criar turma:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, age_group, shift, year, teacherId, teacherProfileId, active } = req.body;

      const existingClass = await prisma.class.findUnique({
        where: { id: Number(id) },
      });

      if (!existingClass) {
        return ApiResponse.notFound(res, 'Turma não encontrada');
      }

      // Se está alterando o professor (user), verifica se ele existe
      if (teacherId) {
        const teacher = await prisma.user.findUnique({
          where: { id: Number(teacherId) },
        });

        if (!teacher) {
          return ApiResponse.notFound(res, 'Professor (usuário) não encontrado');
        }
      }

      // Se está alterando o teacherProfile, verifica se ele existe
      if (teacherProfileId) {
        const teacherProfile = await prisma.teacher.findUnique({
          where: { id: Number(teacherProfileId) },
        });

        if (!teacherProfile) {
          return ApiResponse.notFound(res, 'Professor (perfil) não encontrado');
        }
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (age_group) updateData.age_group = age_group;
      if (shift) updateData.shift = shift;
      if (year) updateData.year = Number(year);
      if (teacherId) updateData.teacherId = Number(teacherId);
      if (teacherProfileId !== undefined) {
        updateData.teacherProfileId = teacherProfileId ? Number(teacherProfileId) : null;
      }
      if (active !== undefined) updateData.active = active;

      const classData = await prisma.class.update({
        where: { id: Number(id) },
        data: updateData,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          teacherProfile: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              specialization: true,
            },
          },
          _count: {
            select: {
              students: true,
              activities: true,
            },
          },
        },
      });

      return ApiResponse.success(res, classData, 'Turma atualizada com sucesso');
    } catch (error: any) {
      console.error('Erro ao atualizar turma:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const existingClass = await prisma.class.findUnique({
        where: { id: Number(id) },
        include: {
          students: true,
          activities: true,
        },
      });

      if (!existingClass) {
        return ApiResponse.notFound(res, 'Turma não encontrada');
      }

      // Verifica se há alunos ou atividades associadas
      if (existingClass.students.length > 0) {
        return ApiResponse.badRequest(
          res,
          `Não é possível excluir esta turma. Ela possui ${existingClass.students.length} aluno(s) matriculado(s).`
        );
      }

      if (existingClass.activities.length > 0) {
        return ApiResponse.badRequest(
          res,
          `Não é possível excluir esta turma. Ela possui ${existingClass.activities.length} atividade(s) associada(s).`
        );
      }

      // Soft delete
      await prisma.class.update({
        where: { id: Number(id) },
        data: { active: false },
      });

      return ApiResponse.success(res, null, 'Turma excluída com sucesso');
    } catch (error: any) {
      console.error('Erro ao excluir turma:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }
}
