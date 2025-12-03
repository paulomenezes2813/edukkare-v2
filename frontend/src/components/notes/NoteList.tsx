import React from 'react';
import type { Note } from '../../types/note';
import { NoteCard } from './NoteCard';
import { COLORS } from '../../utils/constants';
import { Loading } from '../common/Loading';

interface NoteListProps {
  notes: Note[];
  loading?: boolean;
  onNoteClick?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  loading = false,
  onNoteClick,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <Loading text="Carregando notas..." />;
  }

  if (notes.length === 0) {
    return (
      <div
        style={{
          padding: '3rem',
          textAlign: 'center',
          background: COLORS.background,
          borderRadius: '0.75rem',
          border: `1px dashed ${COLORS.border}`,
        }}
      >
        <p style={{ fontSize: '1.125rem', color: COLORS.textTertiary, marginBottom: '0.5rem' }}>
          📭 Nenhuma nota cadastrada
        </p>
        <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary }}>
          Clique no botão + para adicionar uma nova nota
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => onNoteClick?.(note)}
          onEdit={() => onEdit?.(note)}
          onDelete={() => onDelete?.(note)}
        />
      ))}
    </div>
  );
};

