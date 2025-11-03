import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message = 'Sucesso', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, statusCode = 400, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  static created(res: Response, data: any, message = 'Criado com sucesso') {
    return this.success(res, data, message, 201);
  }

  static badRequest(res: Response, message: string) {
    return this.error(res, message, 400);
  }

  static notFound(res: Response, message = 'Recurso não encontrado') {
    return this.error(res, message, 404);
  }

  static unauthorized(res: Response, message = 'Não autorizado') {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Acesso negado') {
    return this.error(res, message, 403);
  }

  static serverError(res: Response, message = 'Erro interno do servidor') {
    return this.error(res, message, 500);
  }
}

