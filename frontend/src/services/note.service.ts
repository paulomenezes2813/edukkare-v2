import api from './api';
import type { Note } from '../types/note';

export const noteService = {
  getAll: async () => {
    const response = await api.get('/notes');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Note>) => {
    const response = await api.post('/notes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Note>) => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

