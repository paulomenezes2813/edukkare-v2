import { useState, useEffect, useCallback } from 'react';
import { schoolService } from '../services/school.service';
import type { School } from '../types/school';

export const useSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await schoolService.getAll();
      if (response.success) {
        setSchools(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar escolas');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar escolas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSchool = useCallback(async (data: Partial<School>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await schoolService.create(data);
      if (response.success) {
        await loadSchools();
        return response;
      } else {
        setError(response.message || 'Erro ao criar escola');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar escola');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadSchools]);

  const updateSchool = useCallback(async (id: number, data: Partial<School>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await schoolService.update(id, data);
      if (response.success) {
        await loadSchools();
        return response;
      } else {
        setError(response.message || 'Erro ao atualizar escola');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar escola');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadSchools]);

  const deleteSchool = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await schoolService.delete(id);
      if (response.success) {
        await loadSchools();
        return response;
      } else {
        setError(response.message || 'Erro ao excluir escola');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir escola');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadSchools]);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  return {
    schools,
    loading,
    error,
    loadSchools,
    createSchool,
    updateSchool,
    deleteSchool,
  };
};

