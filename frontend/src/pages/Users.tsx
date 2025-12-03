import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Loading } from '../components/common/Loading';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { COLORS, NIVEL_ACESSO } from '../utils/constants';
import type { User } from '../types/auth';

export default function Users() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PROFESSOR' as 'PROFESSOR' | 'COORDENADOR' | 'GESTOR' | 'ADMIN',
    nivelAcesso: 'ESTRATEGICO' as keyof typeof NIVEL_ACESSO,
  });

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role as any,
        nivelAcesso: (user.nivelAcesso || 'ESTRATEGICO') as keyof typeof NIVEL_ACESSO,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'PROFESSOR',
        nivelAcesso: 'ESTRATEGICO',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      alert('Por favor, preencha pelo menos o nome e o email');
      return;
    }

    if (!editingUser && !formData.password) {
      alert('Por favor, informe uma senha');
      return;
    }

    try {
      const data: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        nivelAcesso: formData.nivelAcesso,
      };

      if (formData.password) {
        data.password = formData.password;
      }

      if (editingUser) {
        await updateUser(editingUser.id, data);
      } else {
        await createUser(data);
      }

      setShowModal(false);
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar usuário');
    }
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Tem certeza que deseja desativar o usuário "${user.name}"?`)) {
      try {
        await deleteUser(user.id);
      } catch (err: any) {
        alert(err.message || 'Erro ao excluir usuário');
      }
    }
  };

  if (loading && users.length === 0) {
    return <Loading fullScreen text="Carregando usuários..." />;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: COLORS.error }}>❌ {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            👥 Gerenciar Usuários
          </h1>
          <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary }}>
            {users.length} usuários cadastrados
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              background: COLORS.background,
              border: `2px solid ${COLORS.border}`,
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: COLORS.textPrimary }}>
                {user.name}
              </h3>
              <span
                style={{
                  background: user.active ? '#dcfce7' : '#fee2e2',
                  color: user.active ? '#166534' : '#dc2626',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}
              >
                {user.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1rem',
                paddingTop: '1rem',
                borderTop: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📧</span>
                <span style={{ fontSize: '0.875rem', color: COLORS.textSecondary }}>{user.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🎭</span>
                <span style={{ fontSize: '0.875rem', color: COLORS.textSecondary }}>{user.role}</span>
              </div>
              {user.nivelAcesso && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🔐</span>
                  <span style={{ fontSize: '0.875rem', color: COLORS.textSecondary }}>{user.nivelAcesso}</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="primary"
                onClick={() => openModal(user)}
                style={{ flex: 1 }}
              >
                ✏️ Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(user)}
              >
                🗑️
              </Button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => openModal()}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '3.5rem',
          height: '3.5rem',
          background: COLORS.primary,
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          zIndex: 100,
        }}
      >
        +
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        title={editingUser ? '✏️ Editar Usuário' : '➕ Novo Usuário'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Nome *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label={editingUser ? 'Senha (deixe vazio para não alterar)' : 'Senha *'}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder={editingUser ? 'Deixe vazio para não alterar' : ''}
          />
          <Select
            label="Função *"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            options={[
              { value: 'PROFESSOR', label: 'Professor' },
              { value: 'COORDENADOR', label: 'Coordenador' },
              { value: 'GESTOR', label: 'Gestor' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
          />
          <Select
            label="Nível de Acesso *"
            value={formData.nivelAcesso}
            onChange={(e) => setFormData({ ...formData, nivelAcesso: e.target.value as any })}
            options={[
              { value: 'ESTRATEGICO', label: '🏢 Estratégico' },
              { value: 'OPERACIONAL', label: '🏫 Operacional' },
              { value: 'PEDAGOGICO', label: '👩‍🏫 Pedagógico' },
              { value: 'NUCLEO_FAMILIAR', label: '👨‍👩‍👧 Núcleo Familiar' },
              { value: 'PROFISSIONAIS_EXTERNOS', label: '🩺 Profissionais Externos' },
            ]}
          />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingUser(null);
              }}
              fullWidth
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} fullWidth>
              {editingUser ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
