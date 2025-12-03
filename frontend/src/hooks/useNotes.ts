import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/note.service';
import type { Note } from '../types/note';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await noteService.getAll();
      if (response.success) {
        setNotes(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar notas');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar notas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (data: Partial<Note>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await noteService.create(data);
      if (response.success) {
        await loadNotes();
        return response;
      } else {
        setError(response.message || 'Erro ao criar nota');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar nota');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  const updateNote = useCallback(async (id: number, data: Partial<Note>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await noteService.update(id, data);
      if (response.success) {
        await loadNotes();
        return response;
      } else {
        setError(response.message || 'Erro ao atualizar nota');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar nota');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  const deleteNote = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await noteService.delete(id);
      if (response.success) {
        await loadNotes();
        return response;
      } else {
        setError(response.message || 'Erro ao excluir nota');
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir nota');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    error,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
  };
};

