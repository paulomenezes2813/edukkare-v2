import React from 'react';
import type { Class } from '../../types/class';
import { COLORS } from '../../utils/constants';

interface ClassCardProps {
  classItem: Class;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  classItem,
  onClick,
  onEdit,
  onDelete,
}) => {
  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case 'MANHA':
        return '🌅 Manhã';
      case 'TARDE':
        return '🌆 Tarde';
      case 'INTEGRAL':
        return '🌞 Integral';
      default:
        return shift;
    }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎒</div>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: COLORS.textPrimary,
              marginBottom: '0.5rem',
            }}
          >
            {classItem.name}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: COLORS.textTertiary }}>
            <span>👶 {classItem.age_group}</span>
            <span>{getShiftLabel(classItem.shift)}</span>
            <span>📅 {classItem.year}</span>
            {classItem._count?.students !== undefined && (
              <span>👥 {classItem._count.students} aluno(s)</span>
            )}
          </div>
          {classItem.teacher && (
            <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary, marginTop: '0.5rem' }}>
              👩‍🏫 {classItem.teacher.name}
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
                  if (window.confirm(`Tem certeza que deseja excluir ${classItem.name}?`)) {
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

