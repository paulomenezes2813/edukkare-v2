import api from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async register(data: { email: string; password: string; name: string; role?: string }) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ data: User }>('/auth/me');
    return response.data.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};

