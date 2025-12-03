import React from 'react';
import { useClasses } from '../hooks/useClasses';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../utils/constants';

export default function Classes() {
  const { classes, loading, error } = useClasses();

  if (loading) {
    return <Loading fullScreen text="Carregando turmas..." />;
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
        🎒 Turmas
      </h1>
      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1rem' }}>
        <p style={{ color: COLORS.textTertiary }}>
          Total de turmas: {classes.length}
        </p>
        {/* Lista de turmas será implementada aqui */}
      </div>
    </div>
  );
}

