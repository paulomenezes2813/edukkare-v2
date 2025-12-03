import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../utils/constants';

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          🏠 Olá, {user?.name || 'Professora'}
        </h1>
        <p style={{ color: COLORS.textTertiary }}>
          Bem-vinda ao sistema Edukkare
        </p>
      </div>
      <div style={{ 
        background: 'white', 
        borderRadius: '0.5rem', 
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
        <h2 style={{ color: COLORS.primary, marginBottom: '0.5rem', fontSize: '1.5rem' }}>
          EDUKKARE
        </h2>
        <p style={{ color: COLORS.textTertiary, marginBottom: '2rem' }}>
          Sistema Inteligente para Educação Infantil
        </p>
        <div style={{
          background: COLORS.backgroundSecondary,
          borderRadius: '0.5rem',
          padding: '1rem',
          color: COLORS.textSecondary
        }}>
          <p>Use o menu lateral para navegar pelas funcionalidades</p>
        </div>
      </div>
    </div>
  );
}

