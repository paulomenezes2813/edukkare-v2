import api from './api';

export interface Avatar {
  id: number;
  avatar: string;
}

export const avatarService = {
  getAll: async () => {
    const response = await api.get('/avatars');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/avatars/${id}`);
    return response.data;
  },

  create: async (data: { avatar: string }) => {
    const response = await api.post('/avatars', data);
    return response.data;
  },

  update: async (id: number, data: { avatar: string }) => {
    const response = await api.put(`/avatars/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/avatars/${id}`);
    return response.data;
  },
};

