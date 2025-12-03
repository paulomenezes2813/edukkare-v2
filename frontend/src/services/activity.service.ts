import api from './api';
import type { Activity, ActivityDocument } from '../types/activity';

export const activityService = {
  getAll: async () => {
    const response = await api.get('/activities');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  create: async (data: Partial<Activity>) => {
    const response = await api.post('/activities', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Activity>) => {
    const response = await api.put(`/activities/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  },

  uploadDocument: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    const response = await api.post(`/activities/${id}/documentation`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getDocuments: async (id: number) => {
    const response = await api.get(`/activities/${id}/documents`);
    return response.data;
  },

  deleteDocument: async (activityId: number, documentId: number) => {
    const response = await api.delete(`/activities/${activityId}/documents/${documentId}`);
    return response.data;
  },
};

