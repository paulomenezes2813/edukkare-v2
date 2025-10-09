import { useState, useEffect, useRef } from 'react';

interface Student {
  id: number;
  name: string;
  birthDate: string;
  shift: string;
  class?: {
    name: string;
  };
}

interface Activity {
  id: number;
  title: string;
  description: string;
  duration: number;
  bnccCode?: {
    code: string;
    name: string;
    field: string;
  };
}

interface CapturedPhoto {
  dataUrl: string;
  studentName: string;
  timestamp: Date;
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [note, setNote] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      loadActivities();
      loadStudents();
    }
  }, []);

  const loadActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔄 Carregando atividades... Token:', token ? 'OK' : 'Não encontrado');
      const response = await fetch('/api/activities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('📚 Resposta de atividades:', data);
      if (data.success) {
        console.log(`✅ ${data.data.length} atividades carregadas`);
        setActivities(data.data);
      } else {
        console.error('❌ Erro na resposta:', data);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar atividades:', err);
    }
  };

  const loadStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (err) {
      console.error('Erro ao carregar alunos:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setIsLoggedIn(true);
        await loadActivities();
        await loadStudents();
      } else {
        setError('Email ou senha inválidos');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowLogin(false);
    setSelectedStudent(null);
  };

  const handleTakePhoto = async () => {
    if (!selectedActivity) {
      alert('⚠️ Selecione uma atividade primeiro');
      return;
    }
    if (!selectedStudent) {
      alert('⚠️ Selecione uma criança primeiro');
      return;
    }
    setCapturedPhoto(null); // Limpa foto anterior
    setShowNoteModal(false); // Fecha anotação se estiver aberta
    setShowCamera(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, // Usa câmera traseira em mobile
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      alert('❌ Não foi possível acessar a câmera. Verifique as permissões.');
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !selectedStudent) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Define as dimensões do canvas para capturar a foto
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenha o frame atual do vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converte para Data URL
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Salva a foto
    setCapturedPhoto({
      dataUrl: photoDataUrl,
      studentName: selectedStudent.name,
      timestamp: new Date()
    });

    // Fecha a câmera
    closeCamera();
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const deletePhoto = () => {
    setCapturedPhoto(null);
  };

  const handleStartRecording = () => {
    if (!selectedActivity) {
      alert('⚠️ Selecione uma atividade primeiro');
      return;
    }
    if (!selectedStudent) {
      alert('⚠️ Selecione uma criança primeiro');
      return;
    }
    setCapturedPhoto(null); // Limpa foto se houver
    setShowCamera(false); // Fecha câmera se estiver aberta
    setShowNoteModal(false); // Fecha anotação se estiver aberta
    setRecording(!recording);
    if (!recording) {
      alert(`🎤 Iniciando gravação de áudio de ${selectedStudent.name}\n\n(Funcionalidade de gravação será implementada)`);
    } else {
      alert('⏹️ Gravação finalizada!');
    }
  };

  const handleSaveNote = () => {
    if (!selectedActivity) {
      alert('⚠️ Selecione uma atividade primeiro');
      return;
    }
    if (!selectedStudent) {
      alert('⚠️ Selecione uma criança primeiro');
      return;
    }
    if (!note.trim()) {
      alert('⚠️ Digite uma anotação primeiro');
      return;
    }
    alert(`✅ Anotação salva para ${selectedStudent.name}:\n\n"${note}"\n\n(Será salva no backend)`);
    setNote('');
    setShowNoteModal(false);
  };

  // Home Page - Mobile Optimized
  if (!showLogin && !isLoggedIn) {
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
          padding: '2rem 1.5rem',
          borderRadius: '1.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🎓</h1>
          <h2 style={{ color: '#8b5cf6', marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: '700' }}>
            EDUKKARE
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Sistema Inteligente para Educação Infantil
          </p>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #86efac',
            padding: '1rem',
            borderRadius: '0.75rem',
            color: '#166534',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            ✅ Sistema Online!
          </div>

          <button
            onClick={() => setShowLogin(true)}
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
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
          >
            🚀 Acessar Sistema
          </button>

          <div style={{
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '0.75rem',
            fontSize: '0.85rem'
          }}>
            <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
              <strong>Login de Teste:</strong>
            </p>
            <p style={{ color: '#8b5cf6', fontSize: '0.8rem' }}>
              admin@edukkare.com<br/>123456
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Login Page - Mobile Optimized
  if (showLogin && !isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem 1.5rem',
          borderRadius: '1.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ color: '#8b5cf6', fontSize: '1.75rem', marginBottom: '0.25rem', fontWeight: '700' }}>
              🎓 EDUKKARE
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Entre com sua conta</p>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="seu@email.com"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <button
              type="button"
              onClick={() => setShowLogin(false)}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'transparent',
                color: '#8b5cf6',
                border: 'none',
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
                fontWeight: '500'
              }}
            >
              ← Voltar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Dashboard - Mobile First
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Mobile Header - Fixed */}
      <header style={{
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        color: 'white',
        padding: '1rem',
        boxShadow: '0 2px 10px rgba(139, 92, 246, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', marginBottom: '0.125rem', fontWeight: '700' }}>🎓 EDUKKARE</h1>
            <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>Olá, {user.name?.split(' ')[0]}!</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 0.875rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main style={{ padding: '1rem', paddingBottom: '2rem' }}>
        {/* Seleção de Atividade - Compacto */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.75rem', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
            📚 1. Selecione a Atividade
          </h2>
          
          {activities.length === 0 ? (
            <div style={{
              padding: '1rem',
              textAlign: 'center',
              background: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '0.75rem',
              color: '#856404',
              fontSize: '0.75rem'
            }}>
              <p>⚠️ Nenhuma atividade disponível</p>
            </div>
          ) : (
            <>
              <select
                value={selectedActivity?.id || ''}
                onChange={(e) => {
                  const activity = activities.find(a => a.id === Number(e.target.value));
                  setSelectedActivity(activity || null);
                  setSelectedStudent(null);
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  background: 'white',
                  color: '#1e293b',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">Escolha uma atividade...</option>
                {activities.map(activity => (
                  <option key={activity.id} value={activity.id}>
                    {activity.title}
                  </option>
                ))}
              </select>

              {/* Detalhes da Atividade Selecionada */}
              {selectedActivity && (
                <div style={{
                  marginTop: '0.75rem',
                  background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  border: '2px solid #3b82f6',
                  padding: '0.875rem',
                  borderRadius: '0.75rem',
                  color: '#1e40af'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ✓ {selectedActivity.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', lineHeight: '1.4', marginBottom: '0.5rem', opacity: 0.9 }}>
                    {selectedActivity.description}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    fontSize: '0.7rem',
                    marginTop: '0.5rem'
                  }}>
                    {selectedActivity.bnccCode && (
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontWeight: '600'
                      }}>
                        {selectedActivity.bnccCode.code}
                      </span>
                    )}
                    <span style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem'
                    }}>
                      ⏱️ {selectedActivity.duration} min
                    </span>
                    {selectedActivity.bnccCode?.field && (
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.65rem'
                      }}>
                        📖 {selectedActivity.bnccCode.field}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Seleção de Criança - Mobile Compacto */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.75rem', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
            👶 2. Selecione a Criança
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
            gap: '0.5rem'
          }}>
            {students.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                padding: '1rem',
                textAlign: 'center',
                background: '#fff3cd',
                border: '2px solid #ffc107',
                borderRadius: '0.75rem',
                color: '#856404',
                fontSize: '0.75rem'
              }}>
                <p style={{ marginBottom: '0.25rem' }}>⚠️ Nenhum aluno</p>
                <p style={{ fontSize: '0.7rem' }}>npm run seed</p>
              </div>
            ) : (
              students.map(student => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  style={{
                    padding: '0.5rem',
                    background: selectedStudent?.id === student.id ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'white',
                    color: selectedStudent?.id === student.id ? 'white' : '#1e293b',
                    border: selectedStudent?.id === student.id ? 'none' : '2px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    boxShadow: selectedStudent?.id === student.id ? '0 2px 8px rgba(139, 92, 246, 0.4)' : '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>👶</div>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '0.65rem',
                    lineHeight: '1.2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {student.name.split(' ')[0]}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Criança Selecionada - Mobile */}
        {selectedStudent && (
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #86efac',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            marginBottom: '1rem',
            color: '#166534',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            ✅ {selectedStudent.name}
          </div>
        )}

        {/* Botões de Captura - Lado a Lado */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.75rem', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
            📹 Capturar Evidências
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '0.5rem' 
          }}>
            {/* Botão Foto */}
            <button
              onClick={handleTakePhoto}
              style={{
                padding: '1rem 0.5rem',
                background: 'white',
                border: '3px solid #3b82f6',
                borderRadius: '1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                color: '#1e293b',
                minHeight: '120px'
              }}
            >
              <div style={{ fontSize: '2.5rem' }}>📸</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '700', fontSize: '0.8rem', lineHeight: '1.2' }}>
                  Tirar<br/>Foto
                </div>
              </div>
            </button>

            {/* Botão Gravação */}
            <button
              onClick={handleStartRecording}
              style={{
                padding: '1rem 0.5rem',
                background: recording ? '#dc2626' : 'white',
                color: recording ? 'white' : '#1e293b',
                border: recording ? 'none' : '3px solid #dc2626',
                borderRadius: '1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: recording ? '0 4px 15px rgba(220, 38, 38, 0.4)' : '0 2px 8px rgba(0,0,0,0.05)',
                minHeight: '120px'
              }}
            >
              <div style={{ fontSize: '2.5rem' }}>{recording ? '⏹️' : '🎤'}</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '700', fontSize: '0.8rem', lineHeight: '1.2' }}>
                  {recording ? 'Parar' : 'Gravar'}<br/>{recording ? 'Gravação' : 'Áudio'}
                </div>
              </div>
            </button>

            {/* Botão Anotação */}
            <button
              onClick={() => {
                if (!selectedActivity) {
                  alert('⚠️ Selecione uma atividade primeiro');
                  return;
                }
                if (!selectedStudent) {
                  alert('⚠️ Selecione uma criança primeiro');
                  return;
                }
                setCapturedPhoto(null); // Remove a foto para dar espaço para anotação
                setShowCamera(false); // Fecha a câmera se estiver aberta
                setRecording(false); // Para gravação se estiver ativa
                setShowNoteModal(true);
              }}
              style={{
                padding: '1rem 0.5rem',
                background: 'white',
                border: '3px solid #10b981',
                borderRadius: '1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                color: '#1e293b',
                minHeight: '120px'
              }}
            >
              <div style={{ fontSize: '2.5rem' }}>📝</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '700', fontSize: '0.8rem', lineHeight: '1.2' }}>
                  Fazer<br/>Anotação
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Área de Interação - Câmera, Foto ou Anotação */}
        {(showCamera || capturedPhoto || showNoteModal) && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.75rem', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
              {showCamera ? '📸 Preview da Câmera' : capturedPhoto ? '📷 Foto Capturada' : '📝 Anotação'}
            </h2>
            
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '1rem',
              border: showCamera ? '2px solid #3b82f6' : capturedPhoto ? '2px solid #3b82f6' : '2px solid #10b981',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minHeight: '300px'
            }}>
              {/* Preview da Câmera */}
              {showCamera && (
                <div style={{ position: 'relative' }}>
                  <div style={{
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    background: '#eff6ff',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ color: '#1e40af', fontWeight: '700', fontSize: '0.9rem' }}>
                      👶 {selectedStudent?.name}
                    </div>
                    <button
                      onClick={closeCamera}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                  
                  <div style={{ 
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '75%',
                    background: '#000',
                    borderRadius: '0.75rem',
                    overflow: 'hidden'
                  }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  
                  <button
                    onClick={capturePhoto}
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    📸 Capturar Foto
                  </button>
                  
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
              )}

              {/* Foto Capturada */}
              {!showCamera && capturedPhoto && (
                <div>
                  <div style={{
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    background: '#eff6ff',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ color: '#1e40af', fontWeight: '700', fontSize: '0.9rem' }}>
                        👶 {capturedPhoto.studentName}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        {new Date(capturedPhoto.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <button
                      onClick={deletePhoto}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                  <img
                    src={capturedPhoto.dataUrl}
                    alt={`Foto de ${capturedPhoto.studentName}`}
                    style={{
                      width: '100%',
                      borderRadius: '0.75rem',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              {/* Anotação */}
              {!showCamera && !capturedPhoto && showNoteModal && (
                <div>
                  <div style={{
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    background: '#f0fdf4',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ color: '#166534', fontWeight: '700', fontSize: '0.9rem' }}>
                      👶 {selectedStudent?.name}
                    </div>
                    <button
                      onClick={() => {
                        setShowNoteModal(false);
                        setNote('');
                      }}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                  
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Digite sua observação sobre o aluno..."
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'none',
                      minHeight: '200px',
                      boxSizing: 'border-box'
                    }}
                  />
                  
                  <button
                    onClick={handleSaveNote}
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    ✅ Salvar Anotação
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dicas - Mobile */}
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '1rem',
          border: '2px solid #e2e8f0',
          fontSize: '0.8rem'
        }}>
          <h3 style={{ marginBottom: '0.75rem', color: '#1e293b', fontSize: '0.95rem', fontWeight: '700' }}>💡 Dicas</h3>
          <ul style={{ paddingLeft: '1.25rem', color: '#64748b', lineHeight: '1.6' }}>
            <li>Selecione uma criança antes de capturar</li>
            <li>As evidências são salvas automaticamente</li>
            <li>Você pode capturar múltiplas evidências</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
