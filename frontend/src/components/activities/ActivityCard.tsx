import React from 'react';
import type { Activity } from '../../types/activity';
import { COLORS } from '../../utils/constants';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDocumentation?: () => void;
  onRubrics?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onClick,
  onEdit,
  onDelete,
  onDocumentation,
  onRubrics,
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          {activity.activityCode && (
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '0.5rem',
              }}
            >
              {activity.activityCode}
            </div>
          )}
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: COLORS.textPrimary,
              marginBottom: '0.5rem',
            }}
          >
            {activity.title}
          </h3>
          <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary, lineHeight: '1.5' }}>
            {activity.description}
          </p>
        </div>
        {(onEdit || onDelete || onDocumentation || onRubrics) && (
          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
            {onDocumentation && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDocumentation();
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
                title="Anexar documentação"
              >
                📎
              </button>
            )}
            {onRubrics && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRubrics();
                }}
                style={{
                  background: COLORS.warning,
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
                title="Gerenciar rubricas"
              >
                📊
              </button>
            )}
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
                  if (window.confirm(`Tem certeza que deseja excluir "${activity.title}"?`)) {
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

      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: COLORS.textTertiary }}>
        {activity.duration && (
          <span>⏱️ {activity.duration} min</span>
        )}
        {activity.bnccCode && (
          <span>📚 {activity.bnccCode.code}</span>
        )}
        {activity.rubrics && activity.rubrics.length > 0 && (
          <span>📊 {activity.rubrics.length} rubrica(s)</span>
        )}
        {activity.documents && activity.documents.length > 0 && (
          <span>📎 {activity.documents.length} documento(s)</span>
        )}
      </div>
    </div>
  );
};

