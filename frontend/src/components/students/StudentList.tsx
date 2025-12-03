import React from 'react';
import type { Student } from '../../types/students';
import { StudentCard } from './StudentCard';
import { COLORS } from '../../utils/constants';
import { Loading } from '../common/Loading';

interface StudentListProps {
  students: Student[];
  loading?: boolean;
  onStudentClick?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  loading = false,
  onStudentClick,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <Loading text="Carregando estudantes..." />;
  }

  if (students.length === 0) {
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
          📭 Nenhum estudante cadastrado
        </p>
        <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary }}>
          Clique no botão + para adicionar um novo estudante
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
      }}
    >
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          onClick={() => onStudentClick?.(student)}
          onEdit={() => onEdit?.(student)}
          onDelete={() => onDelete?.(student)}
        />
      ))}
    </div>
  );
};

