import api from './api';
import type { Student } from '../types/students';

export const studentService = {
  getAll: async (filters?: { classId?: number; shift?: string; active?: boolean }) => {
    const response = await api.get('/students', { params: filters });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (data: Partial<Student>) => {
    const response = await api.post('/students', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Student>) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

