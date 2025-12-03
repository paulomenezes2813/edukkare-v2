import React, { useState } from 'react';
import { useMenu } from '../../contexts/MenuContext';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../utils/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { menuItems, hasMenuAccess } = useMenu();
  const { setCurrentScreen } = useApp();
  const { user, logout } = useAuth();
  const [localExpanded, setLocalExpanded] = useState<Set<string>>(new Set());

  const handleMenuClick = (screen?: string | null) => {
    onClose();
    if (screen) {
      setCurrentScreen(screen);
    }
  };

  const toggleLocalExpanded = (menuItem: string) => {
    setLocalExpanded(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuItem)) {
        newSet.delete(menuItem);
      } else {
        newSet.add(menuItem);
      }
      return newSet;
    });
  };

  const renderMenuItem = (item: any, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = localExpanded.has(item.menuItem);
    const isActive = item.active !== false;

    if (!isActive && user?.role !== 'ADMIN') {
      return null;
    }

    if (!hasMenuAccess(item.menuItem) && user?.role !== 'ADMIN') {
      return null;
    }

    const paddingLeft = level === 0 ? '1.5rem' : `${3 + level * 1.5}rem`;

    if (hasChildren) {
      return (
        <div key={item.id || item.menuItem}>
          <button
            onClick={() => toggleLocalExpanded(item.menuItem)}
            style={{
              width: '100%',
              padding: level === 0 ? '1rem 1.5rem' : '0.75rem 1.5rem',
              paddingLeft,
              background: level === 0 ? 'white' : 'transparent',
              border: 'none',
              borderLeft: level === 0 ? '4px solid transparent' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: level === 0 ? '1rem' : '0.95rem',
              fontWeight: level === 0 ? '600' : '500',
              color: level === 0 ? COLORS.textSecondary : COLORS.textTertiary,
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.backgroundHover;
              if (level === 0) {
                e.currentTarget.style.borderLeftColor = COLORS.primary;
              } else {
                e.currentTarget.style.color = COLORS.textSecondary;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = level === 0 ? 'white' : 'transparent';
              if (level === 0) {
                e.currentTarget.style.borderLeftColor = 'transparent';
              } else {
                e.currentTarget.style.color = COLORS.textTertiary;
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {item.icon && <span style={{ fontSize: level === 0 ? '1.5rem' : '1.2rem' }}>{item.icon}</span>}
              <span>{item.menuLabel}</span>
            </div>
            <span
              style={{
                fontSize: '1.2rem',
                transition: 'transform 0.2s',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            >
              ▶
            </span>
          </button>
          {isExpanded && (
            <div
              style={{
                background: level === 0 ? COLORS.backgroundSecondary : 'transparent',
                borderLeft: level === 0 ? '4px solid #e2e8f0' : 'none',
              }}
            >
              {item.children.map((child: any) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id || item.menuItem}
        onClick={() => handleMenuClick(item.screen)}
        style={{
          width: '100%',
          padding: level === 0 ? '1rem 1.5rem' : '0.75rem 1.5rem',
          paddingLeft,
          background: level === 0 ? 'white' : 'transparent',
          border: 'none',
          borderLeft: level === 0 ? '4px solid transparent' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: level === 0 ? '1rem' : '0.75rem',
          cursor: 'pointer',
          fontSize: level === 0 ? '1rem' : '0.95rem',
          fontWeight: level === 0 ? '600' : '500',
          color: level === 0 ? COLORS.textSecondary : COLORS.textTertiary,
          transition: 'all 0.2s',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = COLORS.backgroundHover;
          if (level === 0) {
            e.currentTarget.style.borderLeftColor = COLORS.primary;
          } else {
            e.currentTarget.style.color = COLORS.textSecondary;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = level === 0 ? 'white' : 'transparent';
          if (level === 0) {
            e.currentTarget.style.borderLeftColor = 'transparent';
          } else {
            e.currentTarget.style.color = COLORS.textTertiary;
          }
        }}
      >
        {item.icon && <span style={{ fontSize: level === 0 ? '1.5rem' : '1.2rem' }}>{item.icon}</span>}
        <span>{item.menuLabel}</span>
      </button>
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 200,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-280px',
          bottom: 0,
          width: '280px',
          background: 'white',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: 300,
          transition: 'left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            background: COLORS.primary,
            color: 'white',
            padding: '1.5rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              🎓 EDUKKARE
            </h2>
            <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>Menu Principal</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              fontSize: '1.25rem',
              cursor: 'pointer',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Menu Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 0',
          }}
        >
          {menuItems.length > 0 ? (
            menuItems.map((item) => renderMenuItem(item))
          ) : (
            <div style={{ padding: '1rem 1.5rem', color: COLORS.textTertiary }}>
              Carregando menu...
            </div>
          )}

          {/* Sair - sempre visível */}
          <button
            onClick={() => {
              logout();
            }}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              marginTop: '1rem',
              background: 'white',
              border: 'none',
              borderTop: '2px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              color: COLORS.error,
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};

