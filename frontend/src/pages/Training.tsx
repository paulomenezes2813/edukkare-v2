import React from 'react';
import { useActivities } from '../hooks/useActivities';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../utils/constants';
import type { Activity } from '../types/activity';

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
    <div style={{ padding: '1.5rem', background: COLORS.backgroundSecondary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: COLORS.textPrimary, marginBottom: '0.5rem' }}>
          🎓 Centro de Treinamento
        </h1>
        <p style={{ fontSize: '1.125rem', color: COLORS.textTertiary, fontWeight: '500' }}>
          Atividades pedagógicas para aplicar em sala de aula
        </p>
      </div>

      {/* Grid de Atividades */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {activities.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              background: COLORS.background,
              borderRadius: '1rem',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '0.5rem' }}>
              Nenhuma atividade cadastrada
            </h3>
            <p style={{ fontSize: '1rem', color: COLORS.textTertiary }}>
              As atividades cadastradas aparecerão aqui para treinamento
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              style={{
                background: COLORS.background,
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
            >
              {/* Ícone e Título */}
              <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📝</div>
                {activity.activityCode && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: COLORS.primary,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {activity.activityCode}
                  </div>
                )}
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: COLORS.textPrimary,
                    marginBottom: '0.5rem',
                    lineHeight: '1.3',
                  }}
                >
                  {activity.title}
                </h3>
              </div>

              {/* Descrição */}
              <p
                style={{
                  fontSize: '0.875rem',
                  color: COLORS.textTertiary,
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                  flex: 1,
                }}
              >
                {activity.description}
              </p>

              {/* Informações */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                {/* Duração */}
                {activity.duration && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: COLORS.textSecondary,
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>⏱️</span>
                    <span>
                      <strong>Duração:</strong> {activity.duration} minutos
                    </span>
                  </div>
                )}

                {/* Código BNCC */}
                {activity.bnccCode && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: COLORS.textSecondary,
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>📊</span>
                    <div style={{ flex: 1 }}>
                      <div>
                        <strong>BNCC:</strong> {activity.bnccCode.code}
                      </div>
                      {activity.bnccCode.field && (
                        <div style={{ fontSize: '0.75rem', color: COLORS.textTertiary, marginTop: '0.25rem' }}>
                          {activity.bnccCode.field}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Abrir documentação (implementar depois)
                    alert('Funcionalidade de documentação será implementada');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  📖 Ler Documentação
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Abrir tutorial (implementar depois)
                    alert('Funcionalidade de tutorial será implementada');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  🎥 Assistir Tutorial
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
