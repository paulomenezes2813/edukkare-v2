import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useActivities } from '../hooks/useActivities';
import { useStudents } from '../hooks/useStudents';
import { COLORS } from '../utils/constants';
import { getStudentAvatar } from '../utils/helpers';
import type { Activity } from '../types/activity';
import type { Student } from '../types/students';

interface CapturedPhoto {
  dataUrl: string;
  studentName: string;
  studentId: number;
  studentAvatar: string;
  timestamp: Date;
}

type ProficiencyLevel = 'completo' | 'parcial' | 'desenvolvimento' | 'ausente' | null;

export default function Home() {
  const { user } = useAuth();
  const { activities, loading: activitiesLoading } = useActivities();
  const { students, loading: studentsLoading } = useStudents();

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [recording, setRecording] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false);
  const [audioTranscription, setAudioTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleTakePhoto = async () => {
    if (!selectedActivity) {
      alert('⚠️ Selecione uma atividade primeiro');
      return;
    }
    if (!selectedStudent) {
      alert('⚠️ Selecione uma criança primeiro');
      return;
    }
    setCapturedPhoto(null);
    setShowNoteModal(false);
    setShowCamera(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);

    setCapturedPhoto({
      dataUrl: photoDataUrl,
      studentName: selectedStudent.name,
      studentId: selectedStudent.id,
      studentAvatar: getStudentAvatar(selectedStudent),
      timestamp: new Date()
    });

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

    if (recording) {
      // Parar gravação
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setShowTranscriptionModal(true);
        setIsTranscribing(true);
        setAudioTranscription('');

        // Simular transcrição (substituir por API real)
        setTimeout(() => {
          setAudioTranscription('Transcrição do áudio será implementada com API de reconhecimento de voz.');
          setIsTranscribing(false);
        }, 2000);

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
      alert('❌ Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  const handleSaveNote = () => {
    if (!selectedStudent) return;
    alert(`✅ Anotação salva para ${selectedStudent.name}:\n\n"${note}"\n\n(Será salva no backend)`);
    setNote('');
    setShowNoteModal(false);
  };

  const handleSaveTranscription = () => {
    if (!selectedStudent) return;
    alert(`✅ Transcrição salva para ${selectedStudent.name}:\n\n"${audioTranscription}"\n\n(Será salva no backend)`);
    setAudioTranscription('');
    setShowTranscriptionModal(false);
  };

  return (
    <div style={{ padding: '1rem', paddingBottom: '2rem' }}>
      {/* Título da Seção */}
      <h2 style={{ marginBottom: '0.75rem', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
        📚 1. Selecione a Atividade e Rubrica
      </h2>

      {/* Seleção de Atividade e Rubrica */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Seleção de Atividade */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.875rem', fontWeight: '600' }}>
            Atividade
          </label>
          {activitiesLoading ? (
            <div style={{ padding: '1rem', textAlign: 'center', background: '#f8fafc', borderRadius: '0.75rem' }}>
              Carregando...
            </div>
          ) : activities.length === 0 ? (
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
                  setProficiencyLevel(null);
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  border: `1px solid ${COLORS.border}`,
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
                </div>
              )}
            </>
          )}
        </div>

        {/* Seleção de Rubrica */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.875rem', fontWeight: '600' }}>
            Rubrica de Avaliação
          </label>
          <select
            disabled={!selectedActivity}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '0.75rem',
              background: selectedActivity ? 'white' : '#f8fafc',
              color: selectedActivity ? '#1e293b' : '#94a3b8',
              cursor: selectedActivity ? 'pointer' : 'not-allowed',
              boxShadow: selectedActivity ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              outline: 'none',
              fontFamily: 'inherit',
              opacity: selectedActivity ? 1 : 0.6
            }}
          >
            <option value="">Escolha uma rubrica...</option>
            <option value="excelente">⭐⭐⭐ Excelente - Superou expectativas</option>
            <option value="satisfatorio">⭐⭐ Satisfatório - Atingiu objetivos</option>
            <option value="desenvolvimento">⭐ Em Desenvolvimento - Progredindo</option>
            <option value="iniciante">○ Iniciante - Necessita apoio</option>
          </select>

          {selectedActivity && (
            <div style={{
              marginTop: '0.75rem',
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              border: '2px solid #f59e0b',
              padding: '0.875rem',
              borderRadius: '0.75rem',
              color: '#92400e'
            }}>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                📊 Critérios de Avaliação
              </div>
              <div style={{ fontSize: '0.75rem', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '0.25rem' }}>⭐⭐⭐ <strong>Excelente:</strong> Realiza com autonomia e criatividade</div>
                <div style={{ marginBottom: '0.25rem' }}>⭐⭐ <strong>Satisfatório:</strong> Realiza com orientação mínima</div>
                <div style={{ marginBottom: '0.25rem' }}>⭐ <strong>Desenvolvimento:</strong> Realiza com apoio constante</div>
                <div>○ <strong>Iniciante:</strong> Necessita suporte integral</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seleção de Criança */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.75rem', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
          👶 2. Selecione a Criança
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
          gap: '0.5rem'
        }}>
          {studentsLoading ? (
            <div style={{ gridColumn: '1 / -1', padding: '1rem', textAlign: 'center' }}>
              Carregando alunos...
            </div>
          ) : students.length === 0 ? (
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
              <p style={{ marginBottom: '0.25rem' }}>⚠️ Nenhum aluno cadastrado</p>
            </div>
          ) : (
            students.map(student => (
              <div
                key={student.id}
                onClick={() => {
                  setSelectedStudent(student);
                  setProficiencyLevel(null);
                }}
                style={{
                  padding: '0.5rem',
                  background: selectedStudent?.id === student.id ? COLORS.primary : 'white',
                  color: selectedStudent?.id === student.id ? 'white' : '#1e293b',
                  border: selectedStudent?.id === student.id ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: selectedStudent?.id === student.id ? '0 2px 8px rgba(37, 99, 235, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
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

      {/* Criança Selecionada */}
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

      {/* Avaliação Rápida */}
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
            {[
              { level: 'completo' as ProficiencyLevel, emoji: '😊', label: 'Realizou\nCompleto', color: '#10b981' },
              { level: 'parcial' as ProficiencyLevel, emoji: '😐', label: 'Realizou\nParcial', color: '#3b82f6' },
              { level: 'desenvolvimento' as ProficiencyLevel, emoji: '😟', label: 'Em\nDesenvolv.', color: '#f59e0b' },
              { level: 'ausente' as ProficiencyLevel, emoji: '❌', label: 'Não\nParticipou', color: '#ef4444' }
            ].map(({ level, emoji, label, color }) => (
              <div
                key={level}
                onClick={() => setProficiencyLevel(level)}
                style={{
                  padding: '1rem 0.5rem',
                  background: proficiencyLevel === level ? `linear-gradient(135deg, ${color}, ${color}dd)` : 'white',
                  border: proficiencyLevel === level ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: proficiencyLevel === level ? `0 4px 12px ${color}50` : '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{emoji}</div>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  color: proficiencyLevel === level ? 'white' : '#1e293b',
                  lineHeight: '1.2',
                  whiteSpace: 'pre-line'
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botões de Captura */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.75rem', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
          📹 Capturar Evidências
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
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
                Tirar<br />Foto
              </div>
            </div>
          </button>

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
                {recording ? 'Parar' : 'Gravar'}<br />{recording ? 'Gravação' : 'Áudio'}
              </div>
            </div>
          </button>

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
              setCapturedPhoto(null);
              setShowCamera(false);
              setRecording(false);
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
                Fazer<br />Anotação
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', fontWeight: '700', fontSize: '0.9rem' }}>
                    {selectedStudent && (
                      <img
                        src={getStudentAvatar(selectedStudent)}
                        alt={selectedStudent.name}
                        style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', objectFit: 'cover' }}
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
                      src={capturedPhoto.studentAvatar}
                      alt={capturedPhoto.studentName}
                      style={{ width: '2rem', height: '2rem', borderRadius: '50%', objectFit: 'cover' }}
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
                  style={{ width: '100%', borderRadius: '0.75rem', display: 'block' }}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: '700', fontSize: '0.9rem' }}>
                    {selectedStudent && (
                      <img
                        src={getStudentAvatar(selectedStudent)}
                        alt={selectedStudent.name}
                        style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    {selectedStudent?.name}
                  </div>
                  <button
                    onClick={() => setShowNoteModal(false)}
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
                  placeholder="Digite sua anotação aqui..."
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
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
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  💾 Salvar Anotação
                </button>
              </div>
            )}

            {/* Transcrição */}
            {!showCamera && !capturedPhoto && !showNoteModal && showTranscriptionModal && (
              <div>
                <div style={{
                  marginBottom: '0.75rem',
                  padding: '0.75rem',
                  background: '#fef3c7',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400e', fontWeight: '700', fontSize: '0.9rem' }}>
                    {selectedStudent && (
                      <img
                        src={getStudentAvatar(selectedStudent)}
                        alt={selectedStudent.name}
                        style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    {selectedStudent?.name}
                  </div>
                  <button
                    onClick={() => setShowTranscriptionModal(false)}
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
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎤</div>
                    <div>Transcrevendo áudio...</div>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={audioTranscription}
                      onChange={(e) => setAudioTranscription(e.target.value)}
                      placeholder="Transcrição do áudio aparecerá aqui..."
                      style={{
                        width: '100%',
                        minHeight: '200px',
                        padding: '1rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                    <button
                      onClick={handleSaveTranscription}
                      style={{
                        width: '100%',
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      💾 Salvar Transcrição
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
