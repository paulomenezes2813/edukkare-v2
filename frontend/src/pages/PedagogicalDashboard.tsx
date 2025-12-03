import React from 'react';
import { COLORS } from '../utils/constants';

export default function PedagogicalDashboard() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
        🎓 Dashboard Pedagógico
      </h1>
      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '2rem' }}>
        <p style={{ color: COLORS.textTertiary }}>
          Dashboard pedagógico - Conteúdo será implementado aqui
        </p>
      </div>
    </div>
  );
}

