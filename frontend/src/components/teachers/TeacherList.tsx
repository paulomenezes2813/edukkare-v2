import React from 'react';
import type { Teacher } from '../../types/teacher';
import { TeacherCard } from './TeacherCard';
import { COLORS } from '../../utils/constants';
import { Loading } from '../common/Loading';

interface TeacherListProps {
  teachers: Teacher[];
  loading?: boolean;
  onTeacherClick?: (teacher: Teacher) => void;
  onEdit?: (teacher: Teacher) => void;
  onDelete?: (teacher: Teacher) => void;
}

export const TeacherList: React.FC<TeacherListProps> = ({
  teachers,
  loading = false,
  onTeacherClick,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <Loading text="Carregando professores..." />;
  }

  if (teachers.length === 0) {
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
          📭 Nenhum professor cadastrado
        </p>
        <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary }}>
          Clique no botão + para adicionar um novo professor
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {teachers.map((teacher) => (
        <TeacherCard
          key={teacher.id}
          teacher={teacher}
          onClick={() => onTeacherClick?.(teacher)}
          onEdit={() => onEdit?.(teacher)}
          onDelete={() => onDelete?.(teacher)}
        />
      ))}
    </div>
  );
};

