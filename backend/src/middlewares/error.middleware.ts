import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return ApiResponse.error(res, 'Erro de validação', 400, err.errors);
  }

  if (err.name === 'UnauthorizedError') {
    return ApiResponse.unauthorized(res, err.message);
  }

  if (err.code === 'P2002') {
    return ApiResponse.error(res, 'Este registro já existe', 409);
  }

  return ApiResponse.serverError(res, err.message || 'Erro interno do servidor');
};

