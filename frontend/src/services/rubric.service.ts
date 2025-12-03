import api from './api';
import type { Rubric } from '../types/activity';

export const rubricService = {
  getAll: async () => {
    const response = await api.get('/rubrics');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/rubrics/${id}`);
    return response.data;
  },

  getByActivity: async (activityId: number) => {
    const response = await api.get(`/rubrics/activity/${activityId}`);
    return response.data;
  },

  create: async (data: Partial<Rubric>) => {
    const response = await api.post('/rubrics', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Rubric>) => {
    const response = await api.put(`/rubrics/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/rubrics/${id}`);
    return response.data;
  },
};

