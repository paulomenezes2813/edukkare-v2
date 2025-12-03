import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';
import bcrypt from 'bcryptjs';

export class UserController {
  async list(req: AuthRequest, res: Response) {
    try {
      const { active, role } = req.query;

      const where: any = {};
      if (active !== undefined) where.active = active === 'true';
      if (role) where.role = role;

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          nivelAcesso: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          // Não retorna password
        },
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponse.success(res, users);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          nivelAcesso: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          // Não retorna password
        },
      });

      if (!user) {
        return ApiResponse.notFound(res, 'Usuário não encontrado');
      }

      return ApiResponse.success(res, user);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role, nivelAcesso } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return ApiResponse.badRequest(res, 'Nome, email e senha são obrigatórios');
      }

      // Verifica se email já existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return ApiResponse.badRequest(res, 'Email já cadastrado');
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'PROFESSOR',
          nivelAcesso: nivelAcesso || 'PEDAGOGICO',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          nivelAcesso: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return ApiResponse.created(res, user, 'Usuário cadastrado com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password, role, nivelAcesso, active } = req.body;

      // Verifica se usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!existingUser) {
        return ApiResponse.notFound(res, 'Usuário não encontrado');
      }

      // Se está alterando email, verifica se já existe
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });

        if (emailExists) {
          return ApiResponse.badRequest(res, 'Email já cadastrado');
        }
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (nivelAcesso) updateData.nivelAcesso = nivelAcesso;
      if (active !== undefined) updateData.active = active;

      // Se informou nova senha, faz o hash
      if (password && password.trim() !== '') {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          nivelAcesso: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return ApiResponse.success(res, user, 'Usuário atualizado com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verifica se usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!existingUser) {
        return ApiResponse.notFound(res, 'Usuário não encontrado');
      }

      // Soft delete - apenas desativa
      await prisma.user.update({
        where: { id: Number(id) },
        data: { active: false },
      });

      return ApiResponse.success(res, null, 'Usuário desativado com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }
}

