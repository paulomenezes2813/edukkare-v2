import { Router } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// Listar todos os avatares
router.get('/', async (req, res) => {
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
});

// Buscar avatar por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const avatar = await prisma.avatar.findUnique({
      where: { id: Number(id) },
    });

    if (!avatar) {
      return ApiResponse.notFound(res, 'Avatar não encontrado');
    }

    return ApiResponse.success(res, avatar);
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

// Criar novo avatar
router.post('/', async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return ApiResponse.badRequest(res, 'Nome do arquivo do avatar é obrigatório');
    }

    // Verifica se já existe
    const existingAvatar = await prisma.avatar.findFirst({
      where: { avatar },
    });

    if (existingAvatar) {
      return ApiResponse.badRequest(res, 'Avatar com este nome já existe');
    }

    const newAvatar = await prisma.avatar.create({
      data: {
        avatar,
      },
    });

    return ApiResponse.created(res, newAvatar, 'Avatar criado com sucesso');
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

// Atualizar avatar
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;

    // Verifica se avatar existe
    const existingAvatar = await prisma.avatar.findUnique({
      where: { id: Number(id) },
    });

    if (!existingAvatar) {
      return ApiResponse.notFound(res, 'Avatar não encontrado');
    }

    // Se está alterando o nome, verifica se já existe
    if (avatar && avatar !== existingAvatar.avatar) {
      const duplicateAvatar = await prisma.avatar.findFirst({
        where: { avatar },
      });

      if (duplicateAvatar) {
        return ApiResponse.badRequest(res, 'Avatar com este nome já existe');
      }
    }

    const updatedAvatar = await prisma.avatar.update({
      where: { id: Number(id) },
      data: { avatar },
    });

    return ApiResponse.success(res, updatedAvatar, 'Avatar atualizado com sucesso');
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

// Excluir avatar
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se avatar existe
    const existingAvatar = await prisma.avatar.findUnique({
      where: { id: Number(id) },
      include: {
        students: true,
      },
    });

    if (!existingAvatar) {
      return ApiResponse.notFound(res, 'Avatar não encontrado');
    }

    // Verifica se há estudantes usando este avatar
    if (existingAvatar.students.length > 0) {
      return ApiResponse.badRequest(
        res, 
        `Não é possível excluir este avatar. Ele está sendo usado por ${existingAvatar.students.length} aluno(s).`
      );
    }

    await prisma.avatar.delete({
      where: { id: Number(id) },
    });

    return ApiResponse.success(res, null, 'Avatar excluído com sucesso');
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

export default router;
