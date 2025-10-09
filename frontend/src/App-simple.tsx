function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</h1>
        <h2 style={{ color: '#8b5cf6', marginBottom: '0.5rem' }}>EDUKKARE</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Sistema Inteligente para Educação Infantil
        </p>
        <div style={{
          background: '#f0fdf4',
          border: '2px solid #86efac',
          padding: '1rem',
          borderRadius: '0.5rem',
          color: '#166534'
        }}>
          ✅ Frontend React está funcionando!
        </div>
        <p style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
          Backend: <a href="http://localhost:3000" target="_blank" style={{ color: '#8b5cf6' }}>
            http://localhost:3000
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;

