import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user.service';
import type { User } from '../types/auth';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAll();
      if (response.success) {
        setUsers(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar usuários');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.create(data);
      if (response.success) {
        await loadUsers();
        return response;
      } else {
        setError(response.message || 'Erro ao criar usuário');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUsers]);

  const updateUser = useCallback(async (id: number, data: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.update(id, data);
      if (response.success) {
        await loadUsers();
        return response;
      } else {
        setError(response.message || 'Erro ao atualizar usuário');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUsers]);

  const deleteUser = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.delete(id);
      if (response.success) {
        await loadUsers();
        return response;
      } else {
        setError(response.message || 'Erro ao excluir usuário');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

