import React from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { Teacher } from '../../types/teacher';

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Teacher>) => Promise<void>;
  teacher?: Teacher | null;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teacher,
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        specialization: teacher.specialization || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
      });
    }
  }, [teacher, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Por favor, preencha pelo menos o nome e o email');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar professor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={teacher ? '✏️ Editar Professor' : '➕ Novo Professor'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nome Completo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Ex: Maria Silva"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="email@exemplo.com"
        />

        <Input
          label="Telefone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(00) 00000-0000"
        />

        <Input
          label="Especialização"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          placeholder="Ex: Educação Infantil"
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            {teacher ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

