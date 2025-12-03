import { useState, useEffect, useCallback } from 'react';
import { activityService } from '../services/activity.service';
import type { Activity } from '../types/activity';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await activityService.getAll();
      if (response.success) {
        setActivities(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar atividades');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  }, []);

  const getActivityById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await activityService.getById(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Erro ao carregar atividade');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar atividade');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createActivity = useCallback(async (data: Partial<Activity>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await activityService.create(data);
      if (response.success) {
        await loadActivities();
        return response;
      } else {
        setError(response.message || 'Erro ao criar atividade');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar atividade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadActivities]);

  const updateActivity = useCallback(async (id: number, data: Partial<Activity>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await activityService.update(id, data);
      if (response.success) {
        await loadActivities();
        return response;
      } else {
        setError(response.message || 'Erro ao atualizar atividade');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar atividade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadActivities]);

  const deleteActivity = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await activityService.delete(id);
      if (response.success) {
        await loadActivities();
        return response;
      } else {
        setError(response.message || 'Erro ao excluir atividade');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir atividade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadActivities]);

  const uploadDocument = useCallback(async (id: number, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const response = await activityService.uploadDocument(id, file);
      if (response.success) {
        await loadActivities();
        return response;
      } else {
        setError(response.message || 'Erro ao fazer upload do documento');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload do documento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadActivities]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return {
    activities,
    loading,
    error,
    loadActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    uploadDocument,
  };
};

