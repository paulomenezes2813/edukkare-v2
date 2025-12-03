import api from './api';
import type { Class } from '../types/class';

export const classService = {
  getAll: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Class>) => {
    const response = await api.post('/classes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Class>) => {
    const response = await api.put(`/classes/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },
};

