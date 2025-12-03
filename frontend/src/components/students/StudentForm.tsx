import React from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { Student } from '../../types/students';
import type { Class } from '../../types/class';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Student>) => Promise<void>;
  student?: Student | null;
  classes?: Class[];
  avatars?: Array<{ id: number; avatar: string }>;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  student,
  classes = [],
  avatars = [],
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    birthDate: '',
    responsavel: '',
    telefone: '',
    email: '',
    shift: 'MANHA' as 'MANHA' | 'TARDE' | 'INTEGRAL',
    classId: '',
    avatarId: '',
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        birthDate: student.birthDate || '',
        responsavel: student.responsavel || '',
        telefone: student.telefone || '',
        email: student.email || '',
        shift: (student.shift as 'MANHA' | 'TARDE' | 'INTEGRAL') || 'MANHA',
        classId: student.class ? String(student.class) : '',
        avatarId: student.avatar ? String(student.avatar.id) : '',
      });
    } else {
      setFormData({
        name: '',
        birthDate: '',
        responsavel: '',
        telefone: '',
        email: '',
        shift: 'MANHA',
        classId: '',
        avatarId: '',
      });
    }
  }, [student, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate) {
      alert('Por favor, preencha pelo menos o nome e a data de nascimento');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        classId: formData.classId ? parseInt(formData.classId) : undefined,
        avatarId: formData.avatarId ? parseInt(formData.avatarId) : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar estudante:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? '✏️ Editar Aluno' : '➕ Novo Aluno'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nome Completo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Ex: Maria Silva Santos"
        />

        <Input
          label="Data de Nascimento"
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          required
        />

        <Input
          label="Nome do Responsável"
          value={formData.responsavel}
          onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
          placeholder="Ex: Ana Silva"
        />

        <Input
          label="Telefone"
          type="tel"
          value={formData.telefone}
          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          placeholder="(00) 00000-0000"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemplo.com"
        />

        <Select
          label="Turno"
          value={formData.shift}
          onChange={(e) =>
            setFormData({ ...formData, shift: e.target.value as 'MANHA' | 'TARDE' | 'INTEGRAL' })
          }
          options={[
            { value: 'MANHA', label: 'Manhã' },
            { value: 'TARDE', label: 'Tarde' },
            { value: 'INTEGRAL', label: 'Integral' },
          ]}
        />

        {classes.length > 0 && (
          <Select
            label="Turma"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            options={[
              { value: '', label: 'Selecione uma turma...' },
              ...classes.map((c) => ({ value: String(c.id), label: c.name })),
            ]}
          />
        )}

        {avatars.length > 0 && (
          <Select
            label="Avatar"
            value={formData.avatarId}
            onChange={(e) => setFormData({ ...formData, avatarId: e.target.value })}
            options={[
              { value: '', label: 'Selecione um avatar...' },
              ...avatars.map((a) => ({
                value: String(a.id),
                label: a.avatar.replace('.png', '').replace('.jpg', ''),
              })),
            ]}
          />
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            {student ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

