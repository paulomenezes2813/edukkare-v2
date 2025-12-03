import React, { useState, useEffect } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { COLORS } from '../utils/constants';
import { Select } from '../components/common/Select';
import { Loading } from '../components/common/Loading';
import { NIVEL_ACESSO } from '../utils/constants';

export default function MenuAccess() {
  const {
    menuPermissionsByNivel,
    selectedNivelAcesso,
    setSelectedNivelAcesso,
    loadMenuPermissionsByNivel,
    toggleMenuPermission,
    isLoading,
  } = useMenu();

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!menuPermissionsByNivel[selectedNivelAcesso]) {
      loadMenuPermissionsByNivel(selectedNivelAcesso);
    }
  }, [selectedNivelAcesso, loadMenuPermissionsByNivel, menuPermissionsByNivel]);

  const toggleExpanded = (menuItem: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuItem)) {
        newSet.delete(menuItem);
      } else {
        newSet.add(menuItem);
      }
      return newSet;
    });
  };

  const permissions = menuPermissionsByNivel[selectedNivelAcesso] || [];

  const renderMenuItem = (item: any, level: number = 0) => {
    const hasChildren = permissions.some((p) => p.parentItem === item.menuItem);
    const isExpanded = expandedItems.has(item.menuItem);

    return (
      <div key={item.menuItem} style={{ marginLeft: `${level * 1.5}rem` }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem',
            background: level === 0 ? COLORS.backgroundSecondary : 'transparent',
            borderRadius: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.menuItem)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          <input
            type="checkbox"
            checked={item.active}
            onChange={() => toggleMenuPermission(item.menuItem, selectedNivelAcesso)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.875rem', fontWeight: level === 0 ? '600' : '400' }}>
            {item.icon} {item.menuLabel}
          </span>
        </div>
        {hasChildren &&
          isExpanded &&
          permissions
            .filter((p) => p.parentItem === item.menuItem)
            .map((child) => renderMenuItem(child, level + 1))}
      </div>
    );
  };

  if (isLoading) {
    return <Loading fullScreen text="Carregando permissões..." />;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          🎯 Controle de Acesso aos Menus
        </h1>
        <Select
          label="Nível de Acesso"
          value={selectedNivelAcesso}
          onChange={(e) => setSelectedNivelAcesso(e.target.value)}
          options={Object.values(NIVEL_ACESSO).map((nivel) => ({
            value: nivel,
            label: nivel,
          }))}
        />
      </div>

      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem' }}>
        {permissions.length === 0 ? (
          <p style={{ color: COLORS.textTertiary, textAlign: 'center', padding: '2rem' }}>
            Nenhuma permissão encontrada para este nível de acesso
          </p>
        ) : (
          permissions
            .filter((p) => !p.parentItem)
            .map((item) => renderMenuItem(item))
        )}
      </div>
    </div>
  );
}

