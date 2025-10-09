import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboard.service';
import { authService } from '../services/auth.service';
import { DashboardMetrics } from '../types';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = authService.getUser();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        color: 'white',
        padding: '1.5rem',
        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🎓 EDUKKARE</h1>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Olá, {user?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Dashboard</h2>

        {/* Metrics Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <MetricCard
            title="Total de Alunos"
            value={metrics?.totalStudents || 0}
            icon="👶"
            color="#8b5cf6"
          />
          <MetricCard
            title="Avaliações"
            value={metrics?.totalEvaluations || 0}
            icon="📝"
            color="#ec4899"
          />
          <MetricCard
            title="Evidências"
            value={metrics?.totalEvidences || 0}
            icon="📸"
            color="#10b981"
          />
          <MetricCard
            title="Cobertura BNCC"
            value={`${metrics?.bnccCoverage || 0}%`}
            icon="📊"
            color="#f59e0b"
          />
          <MetricCard
            title="Atividades (7 dias)"
            value={metrics?.weeklyActivities || 0}
            icon="⚡"
            color="#06b6d4"
          />
          <MetricCard
            title="Desenvolvimento Médio"
            value={`${metrics?.avgDevelopment || 0}%`}
            icon="🎯"
            color="#8b5cf6"
          />
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Ações Rápidas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <ActionButton 
              label="Ver Alunos" 
              icon="👶"
              onClick={() => navigate('/students')}
            />
            <ActionButton 
              label="Nova Avaliação" 
              icon="📝"
              onClick={() => navigate('/evaluations/new')}
            />
            <ActionButton 
              label="Capturar Evidência" 
              icon="📸"
              onClick={() => navigate('/evidences/new')}
            />
            <ActionButton 
              label="Relatórios" 
              icon="📊"
              onClick={() => navigate('/reports')}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: { title: string; value: number | string; icon: string; color: string }) {
  return (
    <div style={{ 
      background: 'white',
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: `2px solid ${color}15`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
        <div style={{ 
          background: `${color}15`,
          color: color,
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          Ativo
        </div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color, marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
        {title}
      </div>
    </div>
  );
}

function ActionButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'white',
        border: '2px solid #e2e8f0',
        padding: '1rem',
        borderRadius: '0.75rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '1rem',
        transition: 'all 0.2s'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = '#8b5cf6';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span style={{ fontWeight: '500' }}>{label}</span>
    </button>
  );
}

