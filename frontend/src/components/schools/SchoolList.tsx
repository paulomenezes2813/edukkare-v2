import React from 'react';
import type { School } from '../../types/school';
import { SchoolCard } from './SchoolCard';
import { COLORS } from '../../utils/constants';
import { Loading } from '../common/Loading';

interface SchoolListProps {
  schools: School[];
  loading?: boolean;
  onSchoolClick?: (school: School) => void;
  onEdit?: (school: School) => void;
  onDelete?: (school: School) => void;
}

export const SchoolList: React.FC<SchoolListProps> = ({
  schools,
  loading = false,
  onSchoolClick,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <Loading text="Carregando escolas..." />;
  }

  if (schools.length === 0) {
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
          📭 Nenhuma escola cadastrada
        </p>
        <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary }}>
          Clique no botão + para adicionar uma nova escola
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
      {schools.map((school) => (
        <SchoolCard
          key={school.id}
          school={school}
          onClick={() => onSchoolClick?.(school)}
          onEdit={() => onEdit?.(school)}
          onDelete={() => onDelete?.(school)}
        />
      ))}
    </div>
  );
};

