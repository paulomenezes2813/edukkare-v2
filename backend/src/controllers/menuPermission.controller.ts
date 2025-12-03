import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';

export class MenuPermissionController {
  // Listar todas as permissões
  async getAll(req: Request, res: Response) {
    try {
      const permissions = await prisma.menuPermission.findMany({
        orderBy: [
          { nivelAcesso: 'asc' },
          { order: 'asc' },
        ],
      });

      return ApiResponse.success(res, permissions);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  // Listar permissões por nível de acesso
  async getByNivelAcesso(req: Request, res: Response) {
    try {
      const { nivelAcesso } = req.params;

      const permissions = await prisma.menuPermission.findMany({
        where: {
          nivelAcesso: nivelAcesso as any,
          active: true,
        },
        orderBy: { order: 'asc' },
      });

      // Organizar em estrutura de árvore
      const tree = this.buildMenuTree(permissions);

      return ApiResponse.success(res, tree);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  // Retornar menu permitido para usuário logado
  async getMyMenu(req: any, res: Response) {
    try {
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { nivelAcesso: true, role: true },
      });

      if (!user) {
        return ApiResponse.notFound(res, 'Usuário não encontrado');
      }

      // ADMIN sempre tem acesso total
      if (user.role === 'ADMIN') {
        const allPermissions = await prisma.menuPermission.findMany({
          where: { active: true },
          orderBy: { order: 'asc' },
        });
        const tree = this.buildMenuTree(allPermissions);
        return ApiResponse.success(res, tree);
      }

      const permissions = await prisma.menuPermission.findMany({
        where: {
          nivelAcesso: user.nivelAcesso,
          active: true,
        },
        orderBy: { order: 'asc' },
      });

      const tree = this.buildMenuTree(permissions);

      return ApiResponse.success(res, tree);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  // Criar ou atualizar permissão
  async createOrUpdate(req: Request, res: Response) {
    try {
      const { menuItem, menuLabel, parentItem, nivelAcesso, order, icon, screen, active } = req.body;

      // Verificar se já existe
      const existing = await prisma.menuPermission.findUnique({
        where: {
          menuItem_nivelAcesso: {
            menuItem,
            nivelAcesso: nivelAcesso as any,
          },
        },
      });

      let permission;
      if (existing) {
        // Atualizar
        permission = await prisma.menuPermission.update({
          where: { id: existing.id },
          data: {
            menuLabel,
            parentItem,
            order,
            icon,
            screen,
            active: active !== undefined ? active : true,
          },
        });
      } else {
        // Criar
        permission = await prisma.menuPermission.create({
          data: {
            menuItem,
            menuLabel,
            parentItem,
            nivelAcesso: nivelAcesso as any,
            order,
            icon,
            screen,
            active: active !== undefined ? active : true,
          },
        });
      }

      return ApiResponse.success(res, permission, existing ? 'Permissão atualizada' : 'Permissão criada');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  // Atualizar permissão
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { menuLabel, parentItem, order, icon, screen, active } = req.body;

      const permission = await prisma.menuPermission.update({
        where: { id: parseInt(id) },
        data: {
          menuLabel,
          parentItem,
          order,
          icon,
          screen,
          active,
        },
      });

      return ApiResponse.success(res, permission, 'Permissão atualizada');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  // Deletar permissão
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.menuPermission.delete({
        where: { id: parseInt(id) },
      });

      return ApiResponse.success(res, null, 'Permissão deletada');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  // Toggle permissão (habilitar/desabilitar)
  async toggle(req: Request, res: Response) {
    try {
      const { menuItem, nivelAcesso } = req.body;

      const permission = await prisma.menuPermission.findUnique({
        where: {
          menuItem_nivelAcesso: {
            menuItem,
            nivelAcesso: nivelAcesso as any,
          },
        },
      });

      if (!permission) {
        return ApiResponse.notFound(res, 'Permissão não encontrada');
      }

      const updated = await prisma.menuPermission.update({
        where: { id: permission.id },
        data: { active: !permission.active },
      });

      return ApiResponse.success(res, updated, 'Permissão atualizada');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  // Função auxiliar para construir árvore de menu
  private buildMenuTree(permissions: any[]): any[] {
    const map = new Map();
    const roots: any[] = [];

    // Criar mapa de todos os itens
    permissions.forEach(perm => {
      map.set(perm.menuItem, {
        ...perm,
        children: [],
      });
    });

    // Construir árvore
    permissions.forEach(perm => {
      const node = map.get(perm.menuItem);
      if (perm.parentItem) {
        const parent = map.get(perm.parentItem);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Ordenar raízes e filhos
    const sortByOrder = (items: any[]) => {
      items.sort((a, b) => a.order - b.order);
      items.forEach(item => {
        if (item.children.length > 0) {
          sortByOrder(item.children);
        }
      });
    };

    sortByOrder(roots);

    return roots;
  }
}

