import { Request, Response } from 'express';
import { ApiResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

// Mock data até criar model no Prisma
const mockSchools = [
  { id: 1, name: 'Escola Infantil Edukkare', address: 'Rua das Flores, 123', phone: '(85) 3456-7890', email: 'contato@edukkare.com' },
  { id: 2, name: 'Centro Educacional Alegria', address: 'Av. Principal, 456', phone: '(85) 3456-7891', email: 'alegria@edukkare.com' },
];

export class SchoolController {
  async list(req: AuthRequest, res: Response) {
    try {
      // TODO: Substituir por prisma.school.findMany() quando criar model
      return ApiResponse.success(res, mockSchools);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const school = mockSchools.find(s => s.id === Number(id));

      if (!school) {
        return ApiResponse.notFound(res, 'Escola não encontrada');
      }

      return ApiResponse.success(res, school);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, address, phone, email } = req.body;

      // TODO: Substituir por prisma.school.create()
      const newSchool = {
        id: mockSchools.length + 1,
        name,
        address,
        phone,
        email
      };
      
      mockSchools.push(newSchool);

      return ApiResponse.created(res, newSchool, 'Escola cadastrada com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, address, phone, email } = req.body;

      const index = mockSchools.findIndex(s => s.id === Number(id));
      
      if (index === -1) {
        return ApiResponse.notFound(res, 'Escola não encontrada');
      }

      mockSchools[index] = { ...mockSchools[index], name, address, phone, email };

      return ApiResponse.success(res, mockSchools[index], 'Escola atualizada com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const index = mockSchools.findIndex(s => s.id === Number(id));
      
      if (index === -1) {
        return ApiResponse.notFound(res, 'Escola não encontrada');
      }

      mockSchools.splice(index, 1);

      return ApiResponse.success(res, null, 'Escola removida com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }
}

