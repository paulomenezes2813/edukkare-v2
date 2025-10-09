import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/response';

export class DashboardController {
  async getMetrics(req: Request, res: Response) {
    try {
      // Total de alunos ativos
      const totalStudents = await prisma.student.count({
        where: { active: true },
      });

      // Total de avaliações
      const totalEvaluations = await prisma.evaluation.count();

      // Total de evidências
      const totalEvidences = await prisma.evidence.count();

      // Cobertura BNCC (códigos únicos avaliados)
      const bnccCodes = await prisma.bNCCCode.count();
      const evaluatedCodes = await prisma.evaluation.groupBy({
        by: ['bnccCodeId'],
      });
      const bnccCoverage = bnccCodes > 0 
        ? Math.round((evaluatedCodes.length / bnccCodes) * 100) 
        : 0;

      // Atividades da semana
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weeklyActivities = await prisma.evaluation.count({
        where: {
          date: {
            gte: weekAgo,
          },
        },
      });

      // Média de desenvolvimento
      const avgDevelopment = await prisma.evaluation.aggregate({
        _avg: {
          percentage: true,
        },
      });

      return ApiResponse.success(res, {
        totalStudents,
        totalEvaluations,
        totalEvidences,
        bnccCoverage,
        weeklyActivities,
        avgDevelopment: Math.round(avgDevelopment._avg.percentage || 0),
      });
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async getEvolutionChart(req: Request, res: Response) {
    try {
      const { months = 6 } = req.query;

      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - Number(months));

      const evaluations = await prisma.evaluation.groupBy({
        by: ['date'],
        _avg: {
          percentage: true,
        },
        where: {
          date: {
            gte: monthsAgo,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      // Agrupar por mês
      const monthlyData: { [key: string]: number[] } = {};

      evaluations.forEach((item) => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = [];
        }
        
        monthlyData[monthKey].push(item._avg.percentage || 0);
      });

      const chartData = Object.entries(monthlyData).map(([month, values]) => {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return {
          month,
          average: Math.round(avg),
          count: values.length,
        };
      });

      return ApiResponse.success(res, chartData);
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }

  async getStudentProgress(req: Request, res: Response) {
    try {
      const { studentId } = req.params;

      const student = await prisma.student.findUnique({
        where: { id: Number(studentId) },
        include: {
          evaluations: {
            include: {
              activity: true,
              bnccCode: true,
            },
            orderBy: {
              date: 'desc',
            },
          },
        },
      });

      if (!student) {
        return ApiResponse.notFound(res, 'Aluno não encontrado');
      }

      // Calcular média geral
      const avgPercentage = student.evaluations.length > 0
        ? student.evaluations.reduce((sum, ev) => sum + ev.percentage, 0) / student.evaluations.length
        : 0;

      // Agrupar por campo BNCC
      const fieldProgress: { [key: string]: number[] } = {};

      student.evaluations.forEach((evaluation) => {
        const field = evaluation.bnccCode.field;
        if (!fieldProgress[field]) {
          fieldProgress[field] = [];
        }
        fieldProgress[field].push(evaluation.percentage);
      });

      const fieldAverages = Object.entries(fieldProgress).map(([field, percentages]) => ({
        field,
        average: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length),
        count: percentages.length,
      }));

      return ApiResponse.success(res, {
        student: {
          id: student.id,
          name: student.name,
        },
        avgPercentage: Math.round(avgPercentage),
        totalEvaluations: student.evaluations.length,
        fieldProgress: fieldAverages,
        recentEvaluations: student.evaluations.slice(0, 10),
      });
    } catch (error: any) {
      return ApiResponse.serverError(res, error.message);
    }
  }
}

