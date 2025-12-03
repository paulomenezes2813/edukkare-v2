import React from 'react';
import type { Note } from '../../types/note';
import { COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onEdit,
  onDelete,
}) => {
  const getGradeColor = (grade: number) => {
    if (grade >= 8) return COLORS.success;
    if (grade >= 6) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.background,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '0.75rem',
        padding: '1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = COLORS.primary;
          e.currentTarget.style.boxShadow = `0 4px 12px rgba(37, 99, 235, 0.1)`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = COLORS.border;
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: COLORS.textPrimary,
              marginBottom: '0.5rem',
            }}
          >
            {note.studentName}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: COLORS.textTertiary }}>
            <span>📚 {note.disciplina}</span>
            <span>🎒 {note.className}</span>
            <span>📅 {formatDate(note.data)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              background: getGradeColor(note.nota),
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '1.25rem',
              fontWeight: '700',
              minWidth: '3rem',
              textAlign: 'center',
            }}
          >
            {note.nota.toFixed(1)}
          </div>
          {(onEdit || onDelete) && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  style={{
                    background: COLORS.info,
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                  title="Editar"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Tem certeza que deseja excluir esta nota?`)) {
                      onDelete();
                    }
                  }}
                  style={{
                    background: COLORS.error,
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                  title="Excluir"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

