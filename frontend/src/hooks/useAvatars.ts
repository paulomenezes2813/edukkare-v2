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
      if (response.success) {
        setAvatars(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar avatares');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar avatares');
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
        setError(response.message || 'Erro ao criar avatar');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar avatar');
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
        setError(response.message || 'Erro ao atualizar avatar');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar avatar');
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
        setError(response.message || 'Erro ao excluir avatar');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir avatar');
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

