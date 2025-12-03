import React, { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';
import { NoteList } from '../components/notes/NoteList';
import { NoteForm } from '../components/notes/NoteForm';
import { Button } from '../components/common/Button';
import { COLORS } from '../utils/constants';
import type { Note } from '../types/note';

export default function Notes() {
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes();
  const { students } = useStudents();
  const { classes } = useClasses();
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleSubmit = async (data: Partial<Note>) => {
    if (editingNote) {
      await updateNote(editingNote.id, data);
    } else {
      await createNote(data);
    }
    setShowForm(false);
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = async (note: Note) => {
    await deleteNote(note.id);
  };

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: COLORS.error }}>❌ {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          📝 Notas
        </h1>
        <Button onClick={() => {
          setEditingNote(null);
          setShowForm(true);
        }}>
          ➕ Nova Nota
        </Button>
      </div>

      <NoteList
        notes={notes}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <NoteForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingNote(null);
        }}
        onSubmit={handleSubmit}
        note={editingNote}
        classes={classes}
        students={students}
      />
    </div>
  );
}

