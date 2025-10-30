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
  const [userName, setUserName] = useState('');
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
  const [showAIScreen, setShowAIScreen] = useState(false);
  const [proficiencyLevel, setProficiencyLevel] = useState<string | null>(null);
  const [audioTranscription, setAudioTranscription] = useState('');
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Verifica se já está logado e valida o token
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr && token !== 'fake-token-dev') {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || '');
          setIsLoggedIn(true);
          await loadActivities();
          await loadStudents();
        } catch (err) {
          // Token inválido, limpa localStorage
          console.log('❌ Token inválido, limpando sessão...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
        }
      } else {
        // Limpa tokens antigos ou fake
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
      }
    };
    
    validateToken();
  }, []);

  const loadActivities = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const token = localStorage.getItem('token');
      console.log('🔄 Carregando atividades de:', `${API_URL}/activities`);
      const response = await fetch(`${API_URL}/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('📚 Resposta de atividades:', data);
      if (data.success) {
        console.log(`✅ ${data.data.length} atividades carregadas`);
        setActivities(data.data);
      } else if (data.message === 'Token não fornecido' || data.message === 'Token inválido') {
        // Token inválido, força logout
        console.error('❌ Erro de autenticação:', data.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setActivities([]);
      } else {
        console.error('❌ Erro na resposta:', data);
        setActivities([]);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar atividades:', err);
      setActivities([]);
    }
  };

  const loadStudents = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const token = localStorage.getItem('token');
      console.log('🔄 Carregando alunos de:', `${API_URL}/students`);
      const response = await fetch(`${API_URL}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
        console.log(`✅ ${data.data.length} alunos carregados`);
      } else if (data.message === 'Token não fornecido' || data.message === 'Token inválido') {
        // Token inválido, força logout
        console.error('❌ Erro de autenticação:', data.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setStudents([]);
      } else {
        console.error('❌ Erro na resposta:', data);
        setStudents([]);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar alunos:', err);
      setStudents([]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setIsLoggedIn(true);
        setUserName(data.data.user.name || '');
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
    setUserName('');
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

  const handleStartRecording = async () => {
    if (!selectedActivity) {
      alert('⚠️ Selecione uma atividade primeiro');
      return;
    }
    if (!selectedStudent) {
      alert('⚠️ Selecione uma criança primeiro');
      return;
    }

    if (!recording) {
      // Iniciar gravação
      try {
        setCapturedPhoto(null);
        setShowCamera(false);
        setShowNoteModal(false);
        setShowTranscriptionModal(false);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());
          
          // Enviar para transcrição
          await transcribeAudio(audioBlob);
        };

        mediaRecorder.start();
        setRecording(true);
      } catch (err) {
        console.error('Erro ao acessar microfone:', err);
        alert('❌ Não foi possível acessar o microfone. Verifique as permissões.');
      }
    } else {
      // Parar gravação
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const token = localStorage.getItem('token');
      
      console.log('🎤 Iniciando transcrição...', {
        blobSize: audioBlob.size,
        blobType: audioBlob.type,
        studentId: selectedStudent?.id,
        activityId: selectedActivity?.id,
        apiUrl: `${API_URL}/evidence/transcribe`
      });
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('studentId', selectedStudent?.id.toString() || '');
      formData.append('activityId', selectedActivity?.id.toString() || '');

      const response = await fetch(`${API_URL}/evidence/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📡 Resposta do servidor:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      const data = await response.json();
      console.log('📝 Dados recebidos:', data);
      
      if (data.success && data.data && data.data.transcription) {
        console.log('✅ Transcrição bem-sucedida!');
        setAudioTranscription(data.data.transcription);
        setShowTranscriptionModal(true);
      } else {
        console.error('❌ Erro na resposta:', data);
        alert(`❌ Erro ao transcrever áudio: ${data.message || 'Resposta inválida do servidor'}`);
      }
    } catch (err: any) {
      console.error('❌ Erro ao transcrever áudio:', err);
      alert(`❌ Erro ao transcrever áudio: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSaveTranscription = () => {
    if (!audioTranscription.trim()) {
      alert('⚠️ Não há transcrição para salvar');
      return;
    }
    alert(`✅ Transcrição salva para ${selectedStudent?.name}:\n\n"${audioTranscription}"\n\n(Será salva no backend)`);
    setAudioTranscription('');
    setShowTranscriptionModal(false);
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
    // Tela do Assistente Inteligente
    if (showAIScreen) {
      return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
          {/* Header */}
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
              <button
                onClick={() => setShowAIScreen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1.125rem'
                }}
              >
                ←
              </button>
              <h1 style={{ fontSize: '1.125rem', fontWeight: '700' }}>🤖 Assistente Inteligente</h1>
              <div style={{ width: '2.5rem' }}></div>
            </div>
          </header>

          <main style={{ padding: '1rem', paddingBottom: '2rem' }}>
            {/* Análise da Semana */}
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '1rem',
              border: '2px solid #e2e8f0',
              marginBottom: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  📊
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#1e293b', fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    Análise da Semana
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Baseado em 23 atividades registradas
                  </p>
                </div>
              </div>
            </div>

            {/* Atenção Necessária */}
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '1rem',
              border: '2px solid #fbbf24',
              marginBottom: '1rem',
              boxShadow: '0 2px 8px rgba(251, 191, 36, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                <h3 style={{ color: '#92400e', fontSize: '0.95rem', fontWeight: '700' }}>
                  Atenção Necessária
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: '1.5' }}>
                3 alunos (<strong>João Pedro</strong>, <strong>Maria Silva</strong>, <strong>Lucas Santos</strong>) 
                demonstraram dificuldade em atividades de linguagem esta semana. Recomenda-se reforço com atividades de 
                contação de histórias e jogos de vocabulário.
              </p>
            </div>

            {/* Sugestão para Amanhã */}
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '1rem',
              border: '2px solid #10b981',
              marginBottom: '1rem',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>💡</span>
                <h3 style={{ color: '#065f46', fontSize: '0.95rem', fontWeight: '700' }}>
                  Sugestão para Amanhã
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                Com base no progresso atual, sugerimos a atividade <strong>"Caixa Sensorial"</strong> para trabalhar 
                as habilidades <strong>EI02TS01</strong> e <strong>EI02CG02</strong>, focando no desenvolvimento 
                tátil e coordenação motora.
              </p>
              <div style={{
                background: '#f0fdf4',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginTop: '0.75rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: '600', marginBottom: '0.25rem' }}>
                  📖 Campo: Traços, sons, cores e formas
                </div>
                <div style={{ fontSize: '0.75rem', color: '#065f46' }}>
                  ⏱️ Duração: 30-40 minutos
                </div>
              </div>
            </div>

            {/* Mensagem para Famílias */}
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '1rem',
              border: '2px solid #6366f1',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>📧</span>
                <h3 style={{ color: '#3730a3', fontSize: '0.95rem', fontWeight: '700' }}>
                  Mensagem para Famílias
                </h3>
              </div>
              <div style={{
                background: '#eef2ff',
                padding: '0.875rem',
                borderRadius: '0.75rem',
                fontSize: '0.85rem',
                color: '#1e293b',
                lineHeight: '1.6',
                fontStyle: 'italic'
              }}>
                "João demonstrou grande evolução na coordenação motora fina! Sugerimos continuar com atividades de 
                pintura e desenho em casa. Usar giz de cera grosso ajuda no desenvolvimento da pegada do lápis."
              </div>
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => alert('✅ Sugestões aceitas!')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                ✅ Aceitar Sugestões
              </button>
              <button
                onClick={() => alert('⚙️ Personalizando análises...')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'white',
                  color: '#64748b',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ⚙️ Personalizar
              </button>
            </div>
          </main>
        </div>
      );
    }
    
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
              <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>Olá, Professora {userName}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setShowAIScreen(true)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 0.875rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                🤖
              </button>
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
                  setProficiencyLevel(null); // Reset avaliação ao trocar de atividade
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
                  onClick={() => {
                    setSelectedStudent(student);
                    setProficiencyLevel(null); // Reset avaliação ao trocar de aluno
                  }}
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

        {/* Avaliação Rápida - Níveis de Proficiência */}
        {selectedStudent && selectedActivity && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.75rem', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
              ⭐ 3. Avalie o Desempenho
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem'
            }}>
              {/* Realizou por completo */}
              <div
                onClick={() => setProficiencyLevel('completo')}
                style={{
                  padding: '1rem 0.5rem',
                  background: proficiencyLevel === 'completo' ? 'linear-gradient(135deg, #10b981, #059669)' : 'white',
                  border: proficiencyLevel === 'completo' ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: proficiencyLevel === 'completo' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>😊</div>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  color: proficiencyLevel === 'completo' ? 'white' : '#1e293b',
                  lineHeight: '1.2'
                }}>
                  Realizou<br/>Completo
                </div>
              </div>

              {/* Realizou parcialmente */}
              <div
                onClick={() => setProficiencyLevel('parcial')}
                style={{
                  padding: '1rem 0.5rem',
                  background: proficiencyLevel === 'parcial' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'white',
                  border: proficiencyLevel === 'parcial' ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: proficiencyLevel === 'parcial' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>😐</div>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  color: proficiencyLevel === 'parcial' ? 'white' : '#1e293b',
                  lineHeight: '1.2'
                }}>
                  Realizou<br/>Parcial
                </div>
              </div>

              {/* Em desenvolvimento */}
              <div
                onClick={() => setProficiencyLevel('desenvolvimento')}
                style={{
                  padding: '1rem 0.5rem',
                  background: proficiencyLevel === 'desenvolvimento' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'white',
                  border: proficiencyLevel === 'desenvolvimento' ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: proficiencyLevel === 'desenvolvimento' ? '0 4px 12px rgba(245, 158, 11, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>😟</div>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  color: proficiencyLevel === 'desenvolvimento' ? 'white' : '#1e293b',
                  lineHeight: '1.2'
                }}>
                  Em<br/>Desenvolv.
                </div>
              </div>

              {/* Não participou */}
              <div
                onClick={() => setProficiencyLevel('ausente')}
                style={{
                  padding: '1rem 0.5rem',
                  background: proficiencyLevel === 'ausente' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'white',
                  border: proficiencyLevel === 'ausente' ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: proficiencyLevel === 'ausente' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>❌</div>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  color: proficiencyLevel === 'ausente' ? 'white' : '#1e293b',
                  lineHeight: '1.2'
                }}>
                  Não<br/>Participou
                </div>
              </div>
            </div>

            {/* Descrição da Avaliação Selecionada */}
            {proficiencyLevel && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: 
                  proficiencyLevel === 'completo' ? '#f0fdf4' :
                  proficiencyLevel === 'parcial' ? '#eff6ff' :
                  proficiencyLevel === 'desenvolvimento' ? '#fffbeb' :
                  '#fef2f2',
                border: `2px solid ${
                  proficiencyLevel === 'completo' ? '#86efac' :
                  proficiencyLevel === 'parcial' ? '#93c5fd' :
                  proficiencyLevel === 'desenvolvimento' ? '#fcd34d' :
                  '#fca5a5'
                }`,
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                color: '#1e293b',
                lineHeight: '1.5'
              }}>
                <strong>
                  {proficiencyLevel === 'completo' && '😊 Realizou por completo'}
                  {proficiencyLevel === 'parcial' && '😐 Realizou parcialmente'}
                  {proficiencyLevel === 'desenvolvimento' && '😟 Em desenvolvimento'}
                  {proficiencyLevel === 'ausente' && '❌ Não Participou'}
                </strong>
                <br />
                {proficiencyLevel === 'completo' && 'A criança demonstrou interesse e engajamento'}
                {proficiencyLevel === 'parcial' && 'A criança demonstrou interesse e engajamento parcial'}
                {proficiencyLevel === 'desenvolvimento' && 'A criança não quis participar e nem engajar, mesmo estimulada'}
                {proficiencyLevel === 'ausente' && 'A criança estava ausente da atividade/sala de aula'}
              </div>
            )}
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

              {/* Modal de Transcrição */}
              {!showCamera && !capturedPhoto && showTranscriptionModal && (
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
                    <div style={{ color: '#1e40af', fontWeight: '700', fontSize: '0.9rem' }}>
                      🎤 Transcrição - {selectedStudent?.name}
                    </div>
                    <button
                      onClick={() => {
                        setShowTranscriptionModal(false);
                        setAudioTranscription('');
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
                  
                  {isTranscribing ? (
                    <div style={{
                      padding: '3rem 1rem',
                      textAlign: 'center',
                      background: '#f8fafc',
                      borderRadius: '0.75rem',
                      border: '2px dashed #cbd5e1'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                        Transcrevendo áudio...
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        Aguarde alguns segundos
                      </div>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={audioTranscription}
                        onChange={(e) => setAudioTranscription(e.target.value)}
                        placeholder="A transcrição aparecerá aqui..."
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          fontFamily: 'inherit',
                          resize: 'none',
                          minHeight: '200px',
                          boxSizing: 'border-box',
                          background: '#fefce8'
                        }}
                      />
                      
                      <button
                        onClick={handleSaveTranscription}
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
                        ✅ Salvar Transcrição
                      </button>
                    </>
                  )}
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
