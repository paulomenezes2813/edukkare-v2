import React from 'react';
import type { Teacher } from '../../types/teacher';
import { COLORS } from '../../utils/constants';

interface TeacherCardProps {
  teacher: Teacher;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onClick,
  onEdit,
  onDelete,
}) => {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👩‍🏫</div>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: COLORS.textPrimary,
              marginBottom: '0.5rem',
            }}
          >
            {teacher.name}
          </h3>
          <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary, marginBottom: '0.25rem' }}>
            📧 {teacher.email}
          </p>
          {teacher.phone && (
            <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary, marginBottom: '0.25rem' }}>
              📞 {teacher.phone}
            </p>
          )}
          {teacher.specialization && (
            <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary }}>
              🎓 {teacher.specialization}
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
                title="Editar"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Tem certeza que deseja excluir ${teacher.name}?`)) {
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
  );
};

