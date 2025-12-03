import React from 'react';
import type { Student } from '../../types/students';
import { getStudentAvatar } from '../../utils/helpers';
import { COLORS } from '../../utils/constants';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onClick,
  onEdit,
  onDelete,
}) => {
  const avatarUrl = getStudentAvatar(student);

  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.background,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '0.75rem',
        padding: '1rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
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
      <img
        src={avatarUrl}
        alt={student.name}
        style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          objectFit: 'cover',
          border: `2px solid ${COLORS.border}`,
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/avatares_edukkare/alice.png';
        }}
      />
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: COLORS.textPrimary,
            marginBottom: '0.25rem',
          }}
        >
          {student.name}
        </h3>
        <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary, marginBottom: '0.25rem' }}>
          {student.class?.name || 'Sem turma'}
        </p>
        {student.birthDate && (
          <p style={{ fontSize: '0.75rem', color: COLORS.textTertiary }}>
            {new Date(student.birthDate).toLocaleDateString('pt-BR')}
          </p>
        )}
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
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Tem certeza que deseja excluir ${student.name}?`)) {
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
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
};

