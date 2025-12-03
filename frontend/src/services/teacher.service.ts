import api from './api';
import type { Teacher } from '../types/teacher';

export const teacherService = {
  getAll: async () => {
    const response = await api.get('/teachers');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  create: async (data: Partial<Teacher>) => {
    const response = await api.post('/teachers', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Teacher>) => {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },
};

