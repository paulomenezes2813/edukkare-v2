import { useState, useEffect, useCallback } from 'react';
import { rubricService } from '../services/rubric.service';
import type { Rubric } from '../types/activity';

export const useRubrics = () => {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRubrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await rubricService.getAll();
      if (response.success) {
        setRubrics(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar rubricas');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar rubricas');
    } finally {
      setLoading(false);
    }
  }, []);

  const getRubricsByActivity = useCallback(async (activityId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rubricService.getByActivity(activityId);
      if (response.success) {
        return response.data || [];
      } else {
        setError(response.message || 'Erro ao carregar rubricas');
        return [];
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar rubricas');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createRubric = useCallback(async (data: Partial<Rubric>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rubricService.create(data);
      if (response.success) {
        await loadRubrics();
        return response;
      } else {
        setError(response.message || 'Erro ao criar rubrica');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar rubrica');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRubrics]);

  const updateRubric = useCallback(async (id: number, data: Partial<Rubric>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rubricService.update(id, data);
      if (response.success) {
        await loadRubrics();
        return response;
      } else {
        setError(response.message || 'Erro ao atualizar rubrica');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar rubrica');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRubrics]);

  const deleteRubric = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rubricService.delete(id);
      if (response.success) {
        await loadRubrics();
        return response;
      } else {
        setError(response.message || 'Erro ao excluir rubrica');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir rubrica');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRubrics]);

  useEffect(() => {
    loadRubrics();
  }, [loadRubrics]);

  return {
    rubrics,
    loading,
    error,
    loadRubrics,
    getRubricsByActivity,
    createRubric,
    updateRubric,
    deleteRubric,
  };
};

