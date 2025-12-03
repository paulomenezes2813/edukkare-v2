import React from 'react';
import { useActivities } from '../hooks/useActivities';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../utils/constants';

export default function Training() {
  const { activities, loading, error } = useActivities();

  if (loading) {
    return <Loading fullScreen text="Carregando treinamentos..." />;
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          🎓 Centro de Treinamento
        </h1>
        <p style={{ color: COLORS.textTertiary }}>
          Atividades pedagógicas para aplicar em sala de aula
        </p>
      </div>
      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1rem' }}>
        <p style={{ color: COLORS.textTertiary }}>
          Total de atividades: {activities.length}
        </p>
        {/* Lista de atividades de treinamento será implementada aqui */}
      </div>
    </div>
  );
}

