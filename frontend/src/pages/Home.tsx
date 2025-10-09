import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</h1>
        <h2 style={{ color: '#8b5cf6', marginBottom: '0.5rem', fontSize: '2rem' }}>
          EDUKKARE
        </h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Sistema Inteligente para Educação Infantil
        </p>

        <div style={{
          background: '#f0fdf4',
          border: '2px solid #86efac',
          padding: '1rem',
          borderRadius: '0.5rem',
          color: '#166534',
          marginBottom: '2rem'
        }}>
          ✅ Frontend React está funcionando perfeitamente!
        </div>

        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '1rem',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          🚀 Acessar Sistema
        </button>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '0.5rem'
        }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <strong>Credenciais de Teste:</strong>
          </p>
          <p style={{ color: '#8b5cf6', fontSize: '0.875rem' }}>
            admin@edukkare.com / 123456
          </p>
        </div>

        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          <p>
            Backend API: <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" 
              style={{ color: '#8b5cf6', textDecoration: 'none' }}>
              http://localhost:3000
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

