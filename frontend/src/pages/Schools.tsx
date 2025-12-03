import React from 'react';
import { useSchools } from '../hooks/useSchools';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../utils/constants';

export default function Schools() {
  const { schools, loading, error } = useSchools();

  if (loading) {
    return <Loading fullScreen text="Carregando escolas..." />;
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
        🏫 Escolas
      </h1>
      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1rem' }}>
        <p style={{ color: COLORS.textTertiary }}>
          Total de escolas: {schools.length}
        </p>
        {/* Lista de escolas será implementada aqui */}
      </div>
    </div>
  );
}

