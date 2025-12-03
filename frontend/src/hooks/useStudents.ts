import { useState, useEffect, useCallback } from 'react';
import { studentService } from '../services/student.service';
import type { Student } from '../types/students';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.getAll();
      if (response.success) {
        setStudents(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar estudantes');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar estudantes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (data: Partial<Student>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.create(data);
      if (response.success) {
        await loadStudents();
        return response;
      } else {
        setError(response.message || 'Erro ao criar estudante');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar estudante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStudents]);

  const updateStudent = useCallback(async (id: number, data: Partial<Student>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.update(id, data);
      if (response.success) {
        await loadStudents();
        return response;
      } else {
        setError(response.message || 'Erro ao atualizar estudante');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar estudante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStudents]);

  const deleteStudent = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.delete(id);
      if (response.success) {
        await loadStudents();
        return response;
      } else {
        setError(response.message || 'Erro ao excluir estudante');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir estudante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStudents]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return {
    students,
    loading,
    error,
    loadStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};

