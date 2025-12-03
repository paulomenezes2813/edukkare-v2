import React from 'react';
import { useNotes } from '../hooks/useNotes';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../utils/constants';

export default function Notes() {
  const { notes, loading, error } = useNotes();

  if (loading) {
    return <Loading fullScreen text="Carregando notas..." />;
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
        📝 Notas
      </h1>
      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1rem' }}>
        <p style={{ color: COLORS.textTertiary }}>
          Total de notas: {notes.length}
        </p>
        {/* Lista de notas será implementada aqui */}
      </div>
    </div>
  );
}

