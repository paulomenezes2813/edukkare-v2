import api from './api';
import type { MenuPermission, MenuItem } from '../types/menu';

export const menuService = {
  getAll: async () => {
    const response = await api.get('/menu-permissions');
    return response.data;
  },

  getByNivelAcesso: async (nivelAcesso: string) => {
    const response = await api.get(`/menu-permissions/${nivelAcesso}`);
    return response.data;
  },

  getMyMenu: async () => {
    const response = await api.get('/menu-permissions/user/me');
    return response.data;
  },

  createOrUpdate: async (data: Partial<MenuPermission>) => {
    const response = await api.post('/menu-permissions', data);
    return response.data;
  },

  toggle: async (menuItem: string, nivelAcesso: string) => {
    const response = await api.post('/menu-permissions/toggle', { menuItem, nivelAcesso });
    return response.data;
  },
};

