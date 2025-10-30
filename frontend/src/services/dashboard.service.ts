import api from './api';
import type { DashboardMetrics, ApiResponse } from '../types';

export const dashboardService = {
  async getMetrics() {
    const response = await api.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics');
    return response.data.data;
  },

  async getEvolution(months = 6) {
    const response = await api.get('/dashboard/evolution', { params: { months } });
    return response.data.data;
  },

  async getStudentProgress(studentId: number) {
    const response = await api.get(`/dashboard/student/${studentId}`);
    return response.data.data;
  },
};

