import { useState, useEffect, useCallback } from 'react';
import { teacherService } from '../services/teacher.service';
import type { Teacher } from '../types/teacher';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await teacherService.getAll();
      if (response.success) {
        setTeachers(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar professores');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar professores');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeacher = useCallback(async (data: Partial<Teacher>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teacherService.create(data);
      if (response.success) {
        await loadTeachers();
        return response;
      } else {
        setError(response.message || 'Erro ao criar professor');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar professor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTeachers]);

  const updateTeacher = useCallback(async (id: number, data: Partial<Teacher>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teacherService.update(id, data);
      if (response.success) {
        await loadTeachers();
        return response;
      } else {
        setError(response.message || 'Erro ao atualizar professor');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar professor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTeachers]);

  const deleteTeacher = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teacherService.delete(id);
      if (response.success) {
        await loadTeachers();
        return response;
      } else {
        setError(response.message || 'Erro ao excluir professor');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir professor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTeachers]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  return {
    teachers,
    loading,
    error,
    loadTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
};

