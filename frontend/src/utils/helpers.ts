import { AVATARS } from './constants';
import type { Student } from '../types';

// Função para obter avatar (do banco ou fallback)
export const getStudentAvatar = (student: { id: number; avatar?: { avatar: string } }): string => {
  // Se tem avatar no banco, usa ele
  if (student.avatar?.avatar) {
    return `/avatares_edukkare/${student.avatar.avatar}`;
  }
  // Fallback: usa sistema cíclico baseado no ID
  const avatarIndex = student.id % AVATARS.length;
  return `/avatares_edukkare/${AVATARS[avatarIndex]}`;
};

// Formatação de datas
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Formatação de números
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

// Formatação de tamanho de arquivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Obter URL da API baseado no ambiente
export const getApiUrl = (): string => {
  let API_URL = import.meta.env.VITE_API_URL || '/api';
  if (window.location.hostname.includes('railway.app')) {
    API_URL = 'https://edukkare-v2-production.up.railway.app/api';
  }
  return API_URL;
};

// Obter token de autenticação
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

