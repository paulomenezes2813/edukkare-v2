import { useState, useEffect, useCallback } from 'react';
import { avatarService, type Avatar } from '../services/avatar.service';

export const useAvatars = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAvatars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await avatarService.getAll();
      
      // A resposta da API vem no formato { success: true, data: [...] }
      let avatarsData: Avatar[] = [];
      
      if (response && response.success) {
        avatarsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        // Fallback: se a resposta é um array direto
        avatarsData = response;
      } else if (response && response.data) {
        // Fallback: se tem data mas não tem success
        avatarsData = Array.isArray(response.data) ? response.data : [];
      }
      
      setAvatars(avatarsData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar avatares';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAvatar = useCallback(async (data: { avatar: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await avatarService.create(data);
      if (response.success) {
        await loadAvatars();
        return response;
      } else {
        const errorMsg = response.message || 'Erro ao criar avatar';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadAvatars]);

  const updateAvatar = useCallback(async (id: number, data: { avatar: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await avatarService.update(id, data);
      if (response.success) {
        await loadAvatars();
        return response;
      } else {
        const errorMsg = response.message || 'Erro ao atualizar avatar';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadAvatars]);

  const deleteAvatar = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await avatarService.delete(id);
      if (response.success) {
        await loadAvatars();
        return response;
      } else {
        const errorMsg = response.message || 'Erro ao excluir avatar';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao excluir avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadAvatars]);

  useEffect(() => {
    loadAvatars();
  }, [loadAvatars]);

  return {
    avatars,
    loading,
    error,
    loadAvatars,
    createAvatar,
    updateAvatar,
    deleteAvatar,
  };
};

