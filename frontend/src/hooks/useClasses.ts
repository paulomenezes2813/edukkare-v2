import { useState, useEffect, useCallback } from 'react';
import { classService } from '../services/class.service';
import type { Class } from '../types/class';

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await classService.getAll();
      if (response.success) {
        setClasses(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar turmas');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createClass = useCallback(async (data: Partial<Class>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classService.create(data);
      if (response.success) {
        await loadClasses();
        return response;
      } else {
        setError(response.message || 'Erro ao criar turma');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar turma');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadClasses]);

  const updateClass = useCallback(async (id: number, data: Partial<Class>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classService.update(id, data);
      if (response.success) {
        await loadClasses();
        return response;
      } else {
        setError(response.message || 'Erro ao atualizar turma');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar turma');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadClasses]);

  const deleteClass = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classService.delete(id);
      if (response.success) {
        await loadClasses();
        return response;
      } else {
        setError(response.message || 'Erro ao excluir turma');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir turma');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadClasses]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  return {
    classes,
    loading,
    error,
    loadClasses,
    createClass,
    updateClass,
    deleteClass,
  };
};

