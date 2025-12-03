import React from 'react';
import { useTeachers } from '../hooks/useTeachers';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../utils/constants';

export default function Teachers() {
  const { teachers, loading, error } = useTeachers();

  if (loading) {
    return <Loading fullScreen text="Carregando professores..." />;
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
        👩‍🏫 Professores
      </h1>
      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1rem' }}>
        <p style={{ color: COLORS.textTertiary }}>
          Total de professores: {teachers.length}
        </p>
        {/* Lista de professores será implementada aqui */}
      </div>
    </div>
  );
}

