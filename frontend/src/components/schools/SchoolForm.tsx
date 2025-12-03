import React from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { School } from '../../types/school';

interface SchoolFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<School>) => Promise<void>;
  school?: School | null;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  school,
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (school) {
      setFormData({
        name: school.name || '',
        address: school.address || '',
        phone: school.phone || '',
        email: school.email || '',
      });
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
      });
    }
  }, [school, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Por favor, preencha o nome da escola');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar escola:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={school ? '✏️ Editar Escola' : '➕ Nova Escola'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nome da Escola"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Ex: Escola Municipal ABC"
        />

        <Input
          label="Endereço"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Ex: Rua das Flores, 123"
        />

        <Input
          label="Telefone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(00) 00000-0000"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="escola@exemplo.com"
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            {school ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

