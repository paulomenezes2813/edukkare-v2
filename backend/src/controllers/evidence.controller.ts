import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

export class EvidenceController {
  async list(req: AuthRequest, res: Response) {
    try {
      const { studentId, type, evaluationId } = req.query;

      const where: any = {};

      if (studentId) where.studentId = Number(studentId);
      if (type) where.type = type;
      if (evaluationId) where.evaluationId = Number(evaluationId);

      const evidences = await prisma.evidence.findMany({
        where,
        include: {
          student: true,
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
          evaluation: {
            include: {
              activity: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return ApiResponse.success(res, evidences);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async upload(req: AuthRequest, res: Response) {
    try {
      const { studentId, evaluationId, aiAnalysis, transcription } = req.body;
      const file = req.file;

      if (!file) {
        return ApiResponse.error(res, 'Nenhum arquivo enviado');
      }

      let type: 'FOTO' | 'AUDIO' | 'VIDEO' | 'NOTA' = 'FOTO';

      if (file.mimetype.startsWith('image/')) {
        type = 'FOTO';
      } else if (file.mimetype.startsWith('audio/')) {
        type = 'AUDIO';
      } else if (file.mimetype.startsWith('video/')) {
        type = 'VIDEO';
      }

      const evidence = await prisma.evidence.create({
        data: {
          type,
          filename: file.filename,
          filepath: file.path,
          filesize: file.size,
          mimeType: file.mimetype,
          studentId: Number(studentId),
          teacherId: req.user!.id,
          evaluationId: evaluationId ? Number(evaluationId) : undefined,
          transcription,
          aiAnalysis,
        },
        include: {
          student: true,
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return ApiResponse.created(res, evidence, 'Evidência enviada com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const evidence = await prisma.evidence.findUnique({
        where: { id: Number(id) },
        include: {
          student: true,
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
          evaluation: {
            include: {
              activity: true,
            },
          },
        },
      });

      if (!evidence) {
        return ApiResponse.notFound(res, 'Evidência não encontrada');
      }

      return ApiResponse.success(res, evidence);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.evidence.delete({
        where: { id: Number(id) },
      });

      return ApiResponse.success(res, null, 'Evidência removida com sucesso');
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async transcribe(req: AuthRequest, res: Response) {
    try {
      const { studentId, activityId } = req.body;
      
      if (!req.file) {
        return ApiResponse.error(res, 'Arquivo de áudio não fornecido', 400);
      }

      // Simula transcrição (em produção, usar API real de transcrição)
      const transcription = "A criança demonstrou interesse pela atividade e participou ativamente durante toda a execução. Mostrou evolução nas habilidades motoras e cognitivas propostas.";

      // TODO: Implementar integração com serviço de transcrição real
      // Exemplo com OpenAI Whisper:
      // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      // const transcription = await openai.audio.transcriptions.create({
      //   file: fs.createReadStream(req.file.path),
      //   model: "whisper-1",
      //   language: "pt"
      // });

      return ApiResponse.success(res, {
        transcription,
        studentId,
        activityId,
        audioFile: req.file.filename
      });
    } catch (error: any) {
      console.error('Erro ao transcrever áudio:', error);
      return ApiResponse.serverError(res, 'Erro ao processar transcrição');
    }
  }
}

