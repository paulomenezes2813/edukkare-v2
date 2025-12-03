import React from 'react';
import type { Activity } from '../../types/activity';
import { ActivityCard } from './ActivityCard';
import { COLORS } from '../../utils/constants';
import { Loading } from '../common/Loading';

interface ActivityListProps {
  activities: Activity[];
  loading?: boolean;
  onActivityClick?: (activity: Activity) => void;
  onEdit?: (activity: Activity) => void;
  onDelete?: (activity: Activity) => void;
  onDocumentation?: (activity: Activity) => void;
  onRubrics?: (activity: Activity) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  loading = false,
  onActivityClick,
  onEdit,
  onDelete,
  onDocumentation,
  onRubrics,
}) => {
  if (loading) {
    return <Loading text="Carregando atividades..." />;
  }

  if (activities.length === 0) {
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
          📭 Nenhuma atividade cadastrada
        </p>
        <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary }}>
          Clique no botão + para adicionar uma nova atividade
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onClick={() => onActivityClick?.(activity)}
          onEdit={() => onEdit?.(activity)}
          onDelete={() => onDelete?.(activity)}
          onDocumentation={() => onDocumentation?.(activity)}
          onRubrics={() => onRubrics?.(activity)}
        />
      ))}
    </div>
  );
};

