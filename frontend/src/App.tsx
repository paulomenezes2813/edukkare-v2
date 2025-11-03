import { useState, useEffect, useRef } from 'react';

interface Student {
  id: number;
  name: string;
  birthDate: string;
  shift: string;
  class?: {
    name: string;
  };
  avatar?: {
    id: number;
    avatar: string;
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

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface School {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface CapturedPhoto {
  dataUrl: string;
  studentName: string;
  studentId: number;
  studentAvatar?: string;
  timestamp: Date;
}

// Lista de avatares disponíveis (fallback)
const AVATARS = [
  'alice.png', 'ana.png', 'arthur.png', 'davi.png', 'gabriel.png',
  'heitor.png', 'helena.png', 'joao.png', 'laura.png', 'lucas.png',
  'maria.png', 'miguel.png', 'pedro.png', 'sofia.png', 'valentina.png'
];

// Função para obter avatar (do banco ou fallback)
const getStudentAvatar = (student: { id: number; avatar?: { avatar: string } }): string => {
  // Se tem avatar no banco, usa ele
  if (student.avatar?.avatar) {
    return `/avatares_edukkare/${student.avatar.avatar}`;
  }
  // Fallback: usa sistema cíclico baseado no ID
  const avatarIndex = student.id % AVATARS.length;
  return `/avatares_edukkare/${AVATARS[avatarIndex]}`;
};

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
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'students' | 'teachers' | 'users' | 'schools' | 'activities'>('home');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    birthDate: '',
    responsavel: '',
    telefone: '',
    email: '',
    shift: 'MANHA' as 'MANHA' | 'TARDE' | 'INTEGRAL',
    classId: ''
  });
  
  // Estados para Teachers
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: ''
  });

  // Estados para Users
  const [users, setUsers] = useState<User[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PROFESSOR' as 'PROFESSOR' | 'COORDENADOR' | 'GESTOR' | 'ADMIN'
  });

  // Estados para Schools
  const [schools, setSchools] = useState<School[]>([]);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  // Estados para Activities (complementar)
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    duration: 30
  });

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
      // Se estiver no Railway, usa a URL do backend Railway
      let API_URL = import.meta.env.VITE_API_URL || '/api';
      if (window.location.hostname.includes('railway.app')) {
        API_URL = 'https://edukkare-v2-production.up.railway.app/api';
      }
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
      // Se estiver no Railway, usa a URL do backend Railway
      let API_URL = import.meta.env.VITE_API_URL || '/api';
      if (window.location.hostname.includes('railway.app')) {
        API_URL = 'https://edukkare-v2-production.up.railway.app/api';
      }
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
      // Se estiver no Railway, usa a URL do backend Railway
      let API_URL = import.meta.env.VITE_API_URL || '/api';
      if (window.location.hostname.includes('railway.app')) {
        API_URL = 'https://edukkare-v2-production.up.railway.app/api';
      }
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
      studentId: selectedStudent.id,
      studentAvatar: getStudentAvatar(selectedStudent),
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
    try {
      // Limpa outros estados para que a transcrição ocupe o espaço
      setCapturedPhoto(null);
      setShowCamera(false);
      setShowNoteModal(false);
      
      // Ativa o modal de transcrição (mostrará "Transcrevendo...")
      setShowTranscriptionModal(true);
      setIsTranscribing(true);
      
      // Se estiver no Railway, usa a URL do backend Railway
      let API_URL = import.meta.env.VITE_API_URL || '/api';
      if (window.location.hostname.includes('railway.app')) {
        API_URL = 'https://edukkare-v2-production.up.railway.app/api';
      }
      
      const token = localStorage.getItem('token');
      
      console.log('🎤 Iniciando transcrição...', {
        blobSize: audioBlob.size,
        blobType: audioBlob.type,
        studentId: selectedStudent?.id,
        activityId: selectedActivity?.id,
        apiUrl: `${API_URL}/evidences/transcribe`,
        hostname: window.location.hostname
      });
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('studentId', selectedStudent?.id.toString() || '');
      formData.append('activityId', selectedActivity?.id.toString() || '');

      const response = await fetch(`${API_URL}/evidences/transcribe`, {
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
      
      if (response.ok && data.success) {
        const transcription = data.data?.transcription || data.transcription || 'Transcrição não disponível';
        console.log('✅ Transcrição bem-sucedida:', transcription);
        setAudioTranscription(transcription);
        
        // Debug: Confirmar que o modal está sendo ativado
        console.log('🔔 Transcrição pronta para exibir!', {
          transcriptionLength: transcription.length
        });
      } else {
        console.error('❌ Erro na resposta:', data);
        setShowTranscriptionModal(false);
        alert(`❌ Erro ao transcrever áudio: ${data.message || 'Resposta inválida do servidor'}\n\nStatus: ${response.status}`);
      }
    } catch (err: any) {
      console.error('❌ Erro ao transcrever áudio:', err);
      setShowTranscriptionModal(false);
      alert(`❌ Erro ao transcrever áudio: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsTranscribing(false);
      console.log('🏁 Finalizou processo de transcrição');
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

  // CRUD de Alunos
  const openStudentModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setStudentForm({
        name: student.name,
        birthDate: student.birthDate.split('T')[0],
        responsavel: '',
        telefone: '',
        email: '',
        shift: student.shift as 'MANHA' | 'TARDE' | 'INTEGRAL',
        classId: student.class?.name || ''
      });
    } else {
      setEditingStudent(null);
      setStudentForm({
        name: '',
        birthDate: '',
        responsavel: '',
        telefone: '',
        email: '',
        shift: 'MANHA',
        classId: ''
      });
    }
    setShowStudentModal(true);
  };

  const handleSaveStudent = async () => {
    try {
      if (!studentForm.name.trim() || !studentForm.birthDate) {
        alert('⚠️ Nome e data de nascimento são obrigatórios');
        return;
      }

      let API_URL = import.meta.env.VITE_API_URL || '/api';
      if (window.location.hostname.includes('railway.app')) {
        API_URL = 'https://edukkare-v2-production.up.railway.app/api';
      }
      const token = localStorage.getItem('token');

      const url = editingStudent 
        ? `${API_URL}/students/${editingStudent.id}`
        : `${API_URL}/students`;
      
      const method = editingStudent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...studentForm,
          classId: 1 // Por enquanto usa turma padrão
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`✅ Aluno ${editingStudent ? 'atualizado' : 'cadastrado'} com sucesso!`);
        setShowStudentModal(false);
        await loadStudents(); // Recarrega a lista
      } else {
        alert(`❌ Erro: ${data.message || 'Erro ao salvar aluno'}`);
      }
    } catch (error: any) {
      alert(`❌ Erro ao salvar aluno: ${error.message}`);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`⚠️ Tem certeza que deseja excluir ${student.name}?`)) {
      return;
    }

    try {
      let API_URL = import.meta.env.VITE_API_URL || '/api';
      if (window.location.hostname.includes('railway.app')) {
        API_URL = 'https://edukkare-v2-production.up.railway.app/api';
      }
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/students/${student.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`✅ Aluno excluído com sucesso!`);
        await loadStudents(); // Recarrega a lista
      } else {
        alert(`❌ Erro: ${data.message || 'Erro ao excluir aluno'}`);
      }
    } catch (error: any) {
      alert(`❌ Erro ao excluir aluno: ${error.message}`);
    }
  };

  // CRUD de Professores
  const loadTeachers = async () => {
    setTeachers([
      { id: 1, name: 'Maria Silva', email: 'maria.silva@edukkare.com', phone: '(85) 98765-4321', specialization: 'Educação Infantil' },
      { id: 2, name: 'João Santos', email: 'joao.santos@edukkare.com', phone: '(85) 98765-4322', specialization: 'Pedagogia' },
    ]);
  };

  const openTeacherModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTeacherForm({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone || '',
        specialization: teacher.specialization || ''
      });
    } else {
      setEditingTeacher(null);
      setTeacherForm({ name: '', email: '', phone: '', specialization: '' });
    }
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = async () => {
    if (!teacherForm.name.trim() || !teacherForm.email.trim()) {
      alert('⚠️ Nome e email são obrigatórios');
      return;
    }
    alert(`✅ Professor ${editingTeacher ? 'atualizado' : 'cadastrado'} com sucesso! (Mock)`);
    setShowTeacherModal(false);
    await loadTeachers();
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (!confirm(`⚠️ Tem certeza que deseja excluir ${teacher.name}?`)) return;
    alert(`✅ Professor excluído com sucesso! (Mock)`);
    await loadTeachers();
  };

  // CRUD de Usuários
  const loadUsers = async () => {
    try {
      let API_URL = import.meta.env.VITE_API_URL || '/api';
      if (window.location.hostname.includes('railway.app')) {
        API_URL = 'https://edukkare-v2-production.up.railway.app/api';
      }
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      // Mock data
      setUsers([
        { id: 1, name: 'Admin Sistema', email: 'admin@edukkare.com', role: 'ADMIN', active: true },
        { id: 2, name: 'Maria Silva', email: 'maria.silva@edukkare.com', role: 'PROFESSOR', active: true },
      ]);
    }
  };

  const openUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role as any
      });
    } else {
      setEditingUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'PROFESSOR' });
    }
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      alert('⚠️ Nome e email são obrigatórios');
      return;
    }
    if (!editingUser && !userForm.password.trim()) {
      alert('⚠️ Senha é obrigatória para novos usuários');
      return;
    }
    alert(`✅ Usuário ${editingUser ? 'atualizado' : 'cadastrado'} com sucesso! (Mock)`);
    setShowUserModal(false);
    await loadUsers();
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`⚠️ Tem certeza que deseja excluir ${user.name}?`)) return;
    alert(`✅ Usuário excluído com sucesso! (Mock)`);
    await loadUsers();
  };

  // CRUD de Escolas
  const loadSchools = async () => {
    setSchools([
      { id: 1, name: 'Escola Infantil Edukkare', address: 'Rua das Flores, 123', phone: '(85) 3456-7890', email: 'contato@edukkare.com' },
      { id: 2, name: 'Centro Educacional Alegria', address: 'Av. Principal, 456', phone: '(85) 3456-7891', email: 'alegria@edukkare.com' },
    ]);
  };

  const openSchoolModal = (school?: School) => {
    if (school) {
      setEditingSchool(school);
      setSchoolForm({
        name: school.name,
        address: school.address || '',
        phone: school.phone || '',
        email: school.email || ''
      });
    } else {
      setEditingSchool(null);
      setSchoolForm({ name: '', address: '', phone: '', email: '' });
    }
    setShowSchoolModal(true);
  };

  const handleSaveSchool = async () => {
    if (!schoolForm.name.trim()) {
      alert('⚠️ Nome da escola é obrigatório');
      return;
    }
    alert(`✅ Escola ${editingSchool ? 'atualizada' : 'cadastrada'} com sucesso! (Mock)`);
    setShowSchoolModal(false);
    await loadSchools();
  };

  const handleDeleteSchool = async (school: School) => {
    if (!confirm(`⚠️ Tem certeza que deseja excluir ${school.name}?`)) return;
    alert(`✅ Escola excluída com sucesso! (Mock)`);
    await loadSchools();
  };

  // CRUD de Atividades (complementar ao existente)
  const openActivityModal = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setActivityForm({
        title: activity.title,
        description: activity.description,
        duration: activity.duration
      });
    } else {
      setEditingActivity(null);
      setActivityForm({ title: '', description: '', duration: 30 });
    }
    setShowActivityModal(true);
  };

  const handleSaveActivity = async () => {
    if (!activityForm.title.trim()) {
      alert('⚠️ Título da atividade é obrigatório');
      return;
    }
    alert(`✅ Atividade ${editingActivity ? 'atualizada' : 'cadastrada'} com sucesso! (Mock)`);
    setShowActivityModal(false);
    await loadActivities();
  };

  const handleDeleteActivity = async (activity: Activity) => {
    if (!confirm(`⚠️ Tem certeza que deseja excluir ${activity.title}?`)) return;
    alert(`✅ Atividade excluída com sucesso! (Mock)`);
    await loadActivities();
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setShowSidebar(true)}
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
                  height: '2.5rem'
                }}
              >
                ☰
              </button>
              <div>
                <h1 style={{ fontSize: '1.125rem', marginBottom: '0.125rem', fontWeight: '700' }}>🎓 EDUKKARE</h1>
                <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>Olá, Professora {userName}</p>
              </div>
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

        {/* Backdrop - Overlay escuro quando sidebar está aberto */}
        {showSidebar && (
          <div
            onClick={() => setShowSidebar(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 200
            }}
          />
        )}

        {/* Sidebar - Menu Lateral */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: showSidebar ? 0 : '-280px',
            bottom: 0,
            width: '280px',
            background: 'white',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
            zIndex: 300,
            transition: 'left 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Sidebar Header */}
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            color: 'white',
            padding: '1.5rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>🎓 EDUKKARE</h2>
              <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>Menu Principal</p>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
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
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>

          {/* Menu Items */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            padding: '1rem 0'
          }}>
            {/* Alunos */}
            <button
              onClick={() => {
                setShowSidebar(false);
                setCurrentScreen('students');
              }}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'white',
                border: 'none',
                borderLeft: '4px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderLeftColor = '#8b5cf6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderLeftColor = 'transparent';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>👶</span>
              <span>Alunos</span>
            </button>

            {/* Professores */}
            <button
              onClick={() => {
                setShowSidebar(false);
                setCurrentScreen('teachers');
                loadTeachers();
              }}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'white',
                border: 'none',
                borderLeft: '4px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderLeftColor = '#8b5cf6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderLeftColor = 'transparent';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>👩‍🏫</span>
              <span>Professores</span>
            </button>

            {/* Usuários */}
            <button
              onClick={() => {
                setShowSidebar(false);
                setCurrentScreen('users');
                loadUsers();
              }}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'white',
                border: 'none',
                borderLeft: '4px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderLeftColor = '#8b5cf6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderLeftColor = 'transparent';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>👥</span>
              <span>Usuários</span>
            </button>

            {/* Escolas */}
            <button
              onClick={() => {
                setShowSidebar(false);
                setCurrentScreen('schools');
                loadSchools();
              }}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'white',
                border: 'none',
                borderLeft: '4px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderLeftColor = '#8b5cf6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderLeftColor = 'transparent';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🏫</span>
              <span>Escolas</span>
            </button>

            {/* Atividades */}
            <button
              onClick={() => {
                setShowSidebar(false);
                setCurrentScreen('activities');
              }}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'white',
                border: 'none',
                borderLeft: '4px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderLeftColor = '#8b5cf6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderLeftColor = 'transparent';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📝</span>
              <span>Atividades</span>
            </button>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: '#e2e8f0',
              margin: '1rem 1.5rem'
            }} />

            {/* Logout */}
            <button
              onClick={() => {
                setShowSidebar(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsLoggedIn(false);
                setUserName('');
              }}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'white',
                border: 'none',
                borderLeft: '4px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#dc2626',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fef2f2';
                e.currentTarget.style.borderLeftColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderLeftColor = 'transparent';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🚪</span>
              <span>Sair</span>
            </button>
          </div>

          {/* Sidebar Footer */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc'
          }}>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#64748b',
              textAlign: 'center',
              margin: 0
            }}>
              Edukkare v2.0 © 2025
            </p>
          </div>
        </div>

        {/* Tela de Gerenciamento de Alunos */}
        {currentScreen === 'students' ? (
          <main style={{ padding: '1rem', paddingBottom: '2rem' }}>
            {/* Header da tela de Alunos */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                  👶 Gerenciar Alunos
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {students.length} alunos cadastrados
                </p>
              </div>
              <button
                onClick={() => setCurrentScreen('home')}
                style={{
                  background: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Voltar
              </button>
            </div>

            {/* Grid de Alunos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
              marginBottom: '5rem'
            }}>
              {students.map((student) => (
                <div
                  key={student.id}
                  style={{
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.2)';
                    e.currentTarget.style.borderColor = '#8b5cf6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {/* Avatar e Nome */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <img 
                      src={getStudentAvatar(student)} 
                      alt={student.name}
                      style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #8b5cf6'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '0.25rem'
                      }}>
                        {student.name}
                      </h3>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>
                        {student.class?.name || 'Sem turma'}
                      </p>
                    </div>
                  </div>

                  {/* Informações */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>🎂</span>
                      <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                        {new Date(student.birthDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>⏰</span>
                      <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                        Turno: {student.shift === 'MANHA' ? 'Manhã' : student.shift === 'TARDE' ? 'Tarde' : 'Integral'}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => openStudentModal(student)}
                      style={{
                        flex: 1,
                        background: '#8b5cf6',
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
                        gap: '0.5rem'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student)}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão Flutuante de Adicionar */}
            <button
              onClick={() => openStudentModal()}
              style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '3.5rem',
                height: '3.5rem',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                fontSize: '1.5rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              +
            </button>

            {/* Modal de Formulário */}
            {showStudentModal && (
              <>
                {/* Backdrop */}
                <div
                  onClick={() => setShowStudentModal(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 400
                  }}
                />

                {/* Modal */}
                <div style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  maxWidth: '500px',
                  width: '90%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  zIndex: 500,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}>
                  {/* Header do Modal */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#1e293b'
                    }}>
                      {editingStudent ? '✏️ Editar Aluno' : '➕ Novo Aluno'}
                    </h3>
                    <button
                      onClick={() => setShowStudentModal(false)}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '1.125rem',
                        cursor: 'pointer',
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Formulário */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    {/* Nome */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#475569',
                        marginBottom: '0.5rem'
                      }}>
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        placeholder="Ex: Maria Silva Santos"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* Data de Nascimento */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#475569',
                        marginBottom: '0.5rem'
                      }}>
                        Data de Nascimento *
                      </label>
                      <input
                        type="date"
                        value={studentForm.birthDate}
                        onChange={(e) => setStudentForm({ ...studentForm, birthDate: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* Responsável */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#475569',
                        marginBottom: '0.5rem'
                      }}>
                        Nome do Responsável
                      </label>
                      <input
                        type="text"
                        value={studentForm.responsavel}
                        onChange={(e) => setStudentForm({ ...studentForm, responsavel: e.target.value })}
                        placeholder="Ex: Ana Silva"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* Telefone */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#475569',
                        marginBottom: '0.5rem'
                      }}>
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={studentForm.telefone}
                        onChange={(e) => setStudentForm({ ...studentForm, telefone: e.target.value })}
                        placeholder="(85) 98765-4321"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* Turno */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#475569',
                        marginBottom: '0.5rem'
                      }}>
                        Turno *
                      </label>
                      <select
                        value={studentForm.shift}
                        onChange={(e) => setStudentForm({ ...studentForm, shift: e.target.value as 'MANHA' | 'TARDE' | 'INTEGRAL' })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="MANHA">Manhã</option>
                        <option value="TARDE">Tarde</option>
                        <option value="INTEGRAL">Integral</option>
                      </select>
                    </div>

                    {/* Botões */}
                    <div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      marginTop: '1rem'
                    }}>
                      <button
                        onClick={() => setShowStudentModal(false)}
                        style={{
                          flex: 1,
                          padding: '1rem',
                          background: '#e2e8f0',
                          color: '#475569',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveStudent}
                        style={{
                          flex: 1,
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {editingStudent ? 'Salvar Alterações' : 'Cadastrar Aluno'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        ) : currentScreen === 'teachers' ? (
          <main style={{ padding: '1rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>👩‍🏫 Gerenciar Professores</h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{teachers.length} professores cadastrados</p>
              </div>
              <button onClick={() => setCurrentScreen('home')} style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>← Voltar</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '5rem' }}>
              {teachers.map((teacher) => (
                <div key={teacher.id} style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{teacher.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📧</span><span style={{ fontSize: '0.875rem', color: '#475569' }}>{teacher.email}</span></div>
                    {teacher.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📱</span><span style={{ fontSize: '0.875rem', color: '#475569' }}>{teacher.phone}</span></div>}
                    {teacher.specialization && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🎓</span><span style={{ fontSize: '0.875rem', color: '#475569' }}>{teacher.specialization}</span></div>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openTeacherModal(teacher)} style={{ flex: 1, background: '#8b5cf6', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>✏️ Editar</button>
                    <button onClick={() => handleDeleteTeacher(teacher)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => openTeacherModal()} style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '3.5rem', height: '3.5rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)', zIndex: 100 }}>+</button>
            {showTeacherModal && (
              <><div onClick={() => setShowTeacherModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 400 }} />
              <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', zIndex: 500 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{editingTeacher ? '✏️ Editar Professor' : '➕ Novo Professor'}</h3><button onClick={() => setShowTeacherModal(false)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>✕</button></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Nome *</label><input type="text" value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Email *</label><input type="email" value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Telefone</label><input type="tel" value={teacherForm.phone} onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Especialização</label><input type="text" value={teacherForm.specialization} onChange={(e) => setTeacherForm({ ...teacherForm, specialization: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button onClick={() => setShowTeacherModal(false)} style={{ flex: 1, padding: '1rem', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
                    <button onClick={handleSaveTeacher} style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>{editingTeacher ? 'Salvar' : 'Cadastrar'}</button>
                  </div>
                </div>
              </div></>
            )}
          </main>
        ) : currentScreen === 'users' ? (
          <main style={{ padding: '1rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div><h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>👥 Gerenciar Usuários</h2><p style={{ fontSize: '0.875rem', color: '#64748b' }}>{users.length} usuários cadastrados</p></div>
              <button onClick={() => setCurrentScreen('home')} style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>← Voltar</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '5rem' }}>
              {users.map((user) => (
                <div key={user.id} style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>{user.name}</h3>
                    <span style={{ background: user.active ? '#dcfce7' : '#fee2e2', color: user.active ? '#166534' : '#dc2626', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>{user.active ? 'Ativo' : 'Inativo'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📧</span><span style={{ fontSize: '0.875rem', color: '#475569' }}>{user.email}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🎭</span><span style={{ fontSize: '0.875rem', color: '#475569' }}>{user.role}</span></div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openUserModal(user)} style={{ flex: 1, background: '#8b5cf6', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>✏️ Editar</button>
                    <button onClick={() => handleDeleteUser(user)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => openUserModal()} style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '3.5rem', height: '3.5rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)', zIndex: 100 }}>+</button>
            {showUserModal && (
              <><div onClick={() => setShowUserModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 400 }} />
              <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', zIndex: 500 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{editingUser ? '✏️ Editar Usuário' : '➕ Novo Usuário'}</h3><button onClick={() => setShowUserModal(false)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>✕</button></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Nome *</label><input type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Email *</label><input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Senha {!editingUser && '*'}</label><input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder={editingUser ? 'Deixe vazio para não alterar' : ''} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Função *</label><select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }}><option value="PROFESSOR">Professor</option><option value="COORDENADOR">Coordenador</option><option value="GESTOR">Gestor</option><option value="ADMIN">Admin</option></select></div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button onClick={() => setShowUserModal(false)} style={{ flex: 1, padding: '1rem', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
                    <button onClick={handleSaveUser} style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>{editingUser ? 'Salvar' : 'Cadastrar'}</button>
                  </div>
                </div>
              </div></>
            )}
          </main>
        ) : currentScreen === 'schools' ? (
          <main style={{ padding: '1rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div><h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>🏫 Gerenciar Escolas</h2><p style={{ fontSize: '0.875rem', color: '#64748b' }}>{schools.length} escolas cadastradas</p></div>
              <button onClick={() => setCurrentScreen('home')} style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>← Voltar</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '5rem' }}>
              {schools.map((school) => (
                <div key={school.id} style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{school.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    {school.address && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📍</span><span style={{ fontSize: '0.875rem', color: '#475569' }}>{school.address}</span></div>}
                    {school.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📞</span><span style={{ fontSize: '0.875rem', color: '#475569' }}>{school.phone}</span></div>}
                    {school.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📧</span><span style={{ fontSize: '0.875rem', color: '#475569' }}>{school.email}</span></div>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openSchoolModal(school)} style={{ flex: 1, background: '#8b5cf6', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>✏️ Editar</button>
                    <button onClick={() => handleDeleteSchool(school)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => openSchoolModal()} style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '3.5rem', height: '3.5rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)', zIndex: 100 }}>+</button>
            {showSchoolModal && (
              <><div onClick={() => setShowSchoolModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 400 }} />
              <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', zIndex: 500 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{editingSchool ? '✏️ Editar Escola' : '➕ Nova Escola'}</h3><button onClick={() => setShowSchoolModal(false)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>✕</button></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Nome *</label><input type="text" value={schoolForm.name} onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Endereço</label><input type="text" value={schoolForm.address} onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Telefone</label><input type="tel" value={schoolForm.phone} onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Email</label><input type="email" value={schoolForm.email} onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button onClick={() => setShowSchoolModal(false)} style={{ flex: 1, padding: '1rem', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
                    <button onClick={handleSaveSchool} style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>{editingSchool ? 'Salvar' : 'Cadastrar'}</button>
                  </div>
                </div>
              </div></>
            )}
          </main>
        ) : currentScreen === 'activities' ? (
          <main style={{ padding: '1rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div><h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>📝 Gerenciar Atividades</h2><p style={{ fontSize: '0.875rem', color: '#64748b' }}>{activities.length} atividades cadastradas</p></div>
              <button onClick={() => setCurrentScreen('home')} style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>← Voltar</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '5rem' }}>
              {activities.map((activity) => (
                <div key={activity.id} style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{activity.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>{activity.description}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>⏱️</span><span style={{ fontSize: '0.875rem', color: '#475569' }}>{activity.duration} minutos</span></div>
                    {activity.bnccCode && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📋</span><span style={{ fontSize: '0.875rem', color: '#475569' }}>{activity.bnccCode.code} - {activity.bnccCode.name}</span></div>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openActivityModal(activity)} style={{ flex: 1, background: '#8b5cf6', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>✏️ Editar</button>
                    <button onClick={() => handleDeleteActivity(activity)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => openActivityModal()} style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '3.5rem', height: '3.5rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)', zIndex: 100 }}>+</button>
            {showActivityModal && (
              <><div onClick={() => setShowActivityModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 400 }} />
              <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', zIndex: 500 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{editingActivity ? '✏️ Editar Atividade' : '➕ Nova Atividade'}</h3><button onClick={() => setShowActivityModal(false)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>✕</button></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Título *</label><input type="text" value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Descrição *</label><textarea value={activityForm.description} onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })} rows={4} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Duração (minutos) *</label><input type="number" value={activityForm.duration} onChange={(e) => setActivityForm({ ...activityForm, duration: parseInt(e.target.value) || 30 })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem' }} /></div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button onClick={() => setShowActivityModal(false)} style={{ flex: 1, padding: '1rem', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
                    <button onClick={handleSaveActivity} style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>{editingActivity ? 'Salvar' : 'Cadastrar'}</button>
                  </div>
                </div>
              </div></>
            )}
          </main>
        ) : (
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
                  <img 
                    src={getStudentAvatar(student)} 
                    alt={student.name}
                    style={{ 
                      width: '2.5rem', 
                      height: '2.5rem', 
                      borderRadius: '50%',
                      marginBottom: '0.25rem',
                      objectFit: 'cover'
                    }} 
                  />
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

        {/* Área de Interação - Câmera, Foto, Anotação ou Transcrição */}
        {(showCamera || capturedPhoto || showNoteModal || showTranscriptionModal) && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.75rem', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
              {showCamera ? '📸 Preview da Câmera' : capturedPhoto ? '📷 Foto Capturada' : showTranscriptionModal ? '🎤 Transcrição de Áudio' : '📝 Anotação'}
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
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: '#1e40af', 
                      fontWeight: '700', 
                      fontSize: '0.9rem' 
                    }}>
                      {selectedStudent && (
                        <img 
                          src={getStudentAvatar(selectedStudent)} 
                          alt={selectedStudent.name}
                          style={{ 
                            width: '1.5rem', 
                            height: '1.5rem', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }} 
                        />
                      )}
                      {selectedStudent?.name}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src={capturedPhoto.studentAvatar || '/avatares_edukkare/alice.png'} 
                        alt={capturedPhoto.studentName}
                        style={{ 
                          width: '2rem', 
                          height: '2rem', 
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }} 
                      />
                      <div>
                        <div style={{ color: '#1e40af', fontWeight: '700', fontSize: '0.9rem' }}>
                          {capturedPhoto.studentName}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                          {new Date(capturedPhoto.timestamp).toLocaleString('pt-BR')}
                        </div>
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
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: '#166534', 
                      fontWeight: '700', 
                      fontSize: '0.9rem' 
                    }}>
                      {selectedStudent && (
                        <img 
                          src={getStudentAvatar(selectedStudent)} 
                          alt={selectedStudent.name}
                          style={{ 
                            width: '1.5rem', 
                            height: '1.5rem', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }} 
                        />
                      )}
                      {selectedStudent?.name}
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

              {/* Transcrição */}
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
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: '#1e40af', 
                      fontWeight: '700', 
                      fontSize: '0.9rem' 
                    }}>
                      {selectedStudent && (
                        <img 
                          src={getStudentAvatar(selectedStudent)} 
                          alt={selectedStudent.name}
                          style={{ 
                            width: '1.5rem', 
                            height: '1.5rem', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }} 
                        />
                      )}
                      {selectedStudent?.name}
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
                        placeholder="A transcrição aparecerá aqui. Você pode editar se necessário..."
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
        )}
    </div>
  );
}

export default App;
