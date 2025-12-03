import React from 'react';
import type { Class } from '../../types/class';
import { ClassCard } from './ClassCard';
import { COLORS } from '../../utils/constants';
import { Loading } from '../common/Loading';

interface ClassListProps {
  classes: Class[];
  loading?: boolean;
  onClassClick?: (classItem: Class) => void;
  onEdit?: (classItem: Class) => void;
  onDelete?: (classItem: Class) => void;
}

export const ClassList: React.FC<ClassListProps> = ({
  classes,
  loading = false,
  onClassClick,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <Loading text="Carregando turmas..." />;
  }

  if (classes.length === 0) {
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
          📭 Nenhuma turma cadastrada
        </p>
        <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary }}>
          Clique no botão + para adicionar uma nova turma
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
      {classes.map((classItem) => (
        <ClassCard
          key={classItem.id}
          classItem={classItem}
          onClick={() => onClassClick?.(classItem)}
          onEdit={() => onEdit?.(classItem)}
          onDelete={() => onDelete?.(classItem)}
        />
      ))}
    </div>
  );
};

