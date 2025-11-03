import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';

export class AvatarController {
  async list(req: Request, res: Response) {
    try {
      const avatars = await prisma.avatar.findMany({
        orderBy: {
          id: 'asc',
        },
      });

      return ApiResponse.success(res, avatars);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }
}

