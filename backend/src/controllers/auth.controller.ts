import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';
import { config } from '../config/env';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;

      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        return ApiResponse.error(res, 'Email já cadastrado', 409);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { nivelAcesso } = req.body;

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role || 'PROFESSOR',
          nivelAcesso: nivelAcesso || 'PEDAGOGICO',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          nivelAcesso: true,
          createdAt: true,
        },
      });

      return ApiResponse.created(res, user, 'Usuário cadastrado com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return ApiResponse.unauthorized(res, 'Email ou senha inválidos');
      }

      if (!user.active) {
        return ApiResponse.forbidden(res, 'Usuário inativo');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return ApiResponse.unauthorized(res, 'Email ou senha inválidos');
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const secret = config.jwtSecret;
      const token = jwt.sign(payload, secret, { expiresIn: '7d' });

      return ApiResponse.success(res, {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          nivelAcesso: user.nivelAcesso,
        },
        token,
      }, 'Login realizado com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async me(req: any, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          nivelAcesso: true,
          active: true,
          createdAt: true,
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
}

