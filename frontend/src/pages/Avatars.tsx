import React, { useState } from 'react';
import { useAvatars } from '../hooks/useAvatars';
import { Loading } from '../components/common/Loading';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { COLORS } from '../utils/constants';
import type { Avatar } from '../services/avatar.service';

export default function Avatars() {
  const { avatars, loading, error, createAvatar, updateAvatar, deleteAvatar } = useAvatars();
  const [showModal, setShowModal] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);
  const [avatarForm, setAvatarForm] = useState({ avatar: '' });

  const openModal = (avatar?: Avatar) => {
    if (avatar) {
      setEditingAvatar(avatar);
      setAvatarForm({ avatar: avatar.avatar });
    } else {
      setEditingAvatar(null);
      setAvatarForm({ avatar: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!avatarForm.avatar) {
      alert('Por favor, informe o nome do arquivo');
      return;
    }

    try {
      if (editingAvatar) {
        await updateAvatar(editingAvatar.id, avatarForm);
      } else {
        await createAvatar(avatarForm);
      }
      setShowModal(false);
      setEditingAvatar(null);
      setAvatarForm({ avatar: '' });
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar avatar');
    }
  };

  const handleDelete = async (avatar: Avatar) => {
    if (window.confirm(`Tem certeza que deseja excluir o avatar "${avatar.avatar}"?`)) {
      try {
        await deleteAvatar(avatar.id);
      } catch (err: any) {
        alert(err.message || 'Erro ao excluir avatar');
      }
    }
  };

  if (loading) {
    return <Loading fullScreen text="Carregando avatares..." />;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: COLORS.error }}>❌ {error}</p>
        <Button variant="primary" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            🎭 Gerenciar Avatares
          </h1>
          <p style={{ fontSize: '0.875rem', color: COLORS.textTertiary }}>
            {avatars.length} avatares cadastrados
          </p>
        </div>
      </div>

      {!loading && avatars.length === 0 ? (
        <div style={{ background: COLORS.background, borderRadius: '0.5rem', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
          <p style={{ color: COLORS.textTertiary, fontSize: '1.125rem', marginBottom: '0.5rem' }}>Nenhum avatar cadastrado</p>
          <p style={{ color: COLORS.textTertiary, fontSize: '0.875rem' }}>Clique no botão + para adicionar um novo avatar</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {avatars.map((avatar) => (
          <div
            key={avatar.id}
            style={{
              background: COLORS.background,
              border: `2px solid ${COLORS.border}`,
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              textAlign: 'center',
            }}
          >
            <img
              src={`/avatares_edukkare/${avatar.avatar}`}
              alt={avatar.avatar}
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #8b5cf6',
                marginBottom: '1rem',
              }}
              onError={(e) => {
                e.currentTarget.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3E?%3C/text%3E%3C/svg%3E';
              }}
            />
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: COLORS.textPrimary,
                marginBottom: '0.5rem',
                wordBreak: 'break-word',
              }}
            >
              {avatar.avatar}
            </h3>
            <div style={{ fontSize: '0.75rem', color: COLORS.textTertiary, marginBottom: '1rem' }}>
              ID: {avatar.id}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="primary" onClick={() => openModal(avatar)} style={{ flex: 1 }}>
                ✏️ Editar
              </Button>
              <Button variant="danger" onClick={() => handleDelete(avatar)}>
                🗑️
              </Button>
            </div>
          </div>
          ))}
        </div>
      )}

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
          setEditingAvatar(null);
          setAvatarForm({ avatar: '' });
        }}
        title={editingAvatar ? '✏️ Editar Avatar' : '➕ Novo Avatar'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Nome do Arquivo *"
            value={avatarForm.avatar}
            onChange={(e) => setAvatarForm({ avatar: e.target.value })}
            placeholder="Ex: novo-avatar.png"
          />
          {avatarForm.avatar && (
            <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: COLORS.textTertiary, marginBottom: '0.5rem' }}>Preview:</p>
              <img
                src={`/avatares_edukkare/${avatarForm.avatar}`}
                alt="Preview"
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #8b5cf6',
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="12"%3EImagem não encontrada%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          )}
          <div
            style={{
              background: '#eff6ff',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              color: '#1e40af',
            }}
          >
            💡 <strong>Dica:</strong> Primeiro faça upload da imagem para a pasta{' '}
            <code>/public/avatares_edukkare/</code> do projeto e depois cadastre aqui com o mesmo nome.
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingAvatar(null);
                setAvatarForm({ avatar: '' });
              }}
              fullWidth
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} fullWidth>
              {editingAvatar ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
