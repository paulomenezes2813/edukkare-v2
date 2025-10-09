import api from './api';
import type { Student, ApiResponse } from '../types';

export const studentService = {
  async getAll(filters?: { classId?: number; shift?: string; active?: boolean }) {
    const response = await api.get<ApiResponse<Student[]>>('/students', { params: filters });
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data.data;
  },

  async create(data: Partial<Student>) {
    const response = await api.post<ApiResponse<Student>>('/students', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<Student>) {
    const response = await api.put<ApiResponse<Student>>(`/students/${id}`, data);
    return response.data.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

