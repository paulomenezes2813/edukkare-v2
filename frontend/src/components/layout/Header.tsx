import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { COLORS } from '../../utils/constants';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { currentScreen, setCurrentScreen } = useApp();

  return (
    <header
      style={{
        background: COLORS.primary,
        color: 'white',
        padding: '1rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onMenuClick}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              fontSize: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            ☰
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', marginBottom: '0.125rem', fontWeight: '700' }}>
              🎓 EDUKKARE
            </h1>
            <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>
              Olá, {user?.name || 'Usuário'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Botões de ação rápida podem ser adicionados aqui */}
        </div>
      </div>
    </header>
  );
};

