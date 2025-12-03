import React from 'react';
import { COLORS } from '../utils/constants';

export default function Help() {
  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          ❓ Ajuda no uso da ferramenta
        </h1>
        <p style={{ color: COLORS.textTertiary }}>
          Aprenda a usar todas as funcionalidades da plataforma Edukkare
        </p>
      </div>
      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1rem' }}>
        <p style={{ color: COLORS.textTertiary }}>
          Conteúdo de ajuda será implementado aqui
        </p>
      </div>
    </div>
  );
}

