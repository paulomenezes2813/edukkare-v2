import React from 'react';
import { useStudents } from '../hooks/useStudents';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../utils/constants';

export default function Students() {
  const { students, loading, error } = useStudents();

  if (loading) {
    return <Loading fullScreen text="Carregando estudantes..." />;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: COLORS.error }}>❌ {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
        👶 Alunos
      </h1>
      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1rem' }}>
        <p style={{ color: COLORS.textTertiary }}>
          Total de estudantes: {students.length}
        </p>
        {/* Lista de estudantes será implementada aqui */}
      </div>
    </div>
  );
}

