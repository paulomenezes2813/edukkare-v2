import React from 'react';
import { useRubrics } from '../hooks/useRubrics';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../utils/constants';

export default function Rubrics() {
  const { rubrics, loading, error } = useRubrics();

  if (loading) {
    return <Loading fullScreen text="Carregando rubricas..." />;
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
        📊 Rubricas
      </h1>
      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1rem' }}>
        <p style={{ color: COLORS.textTertiary }}>
          Total de rubricas: {rubrics.length}
        </p>
        {/* Lista de rubricas será implementada aqui */}
      </div>
    </div>
  );
}

