import api from './api';
import type { School } from '../types/school';

export const schoolService = {
  getAll: async () => {
    const response = await api.get('/schools');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/schools/${id}`);
    return response.data;
  },

  create: async (data: Partial<School>) => {
    const response = await api.post('/schools', data);
    return response.data;
  },

  update: async (id: number, data: Partial<School>) => {
    const response = await api.put(`/schools/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/schools/${id}`);
    return response.data;
  },
};

