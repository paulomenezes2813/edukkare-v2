import React from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { Class } from '../../types/class';
import type { Teacher } from '../../types/teacher';

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Class>) => Promise<void>;
  classItem?: Class | null;
  teachers?: Teacher[];
}

export const ClassForm: React.FC<ClassFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classItem,
  teachers = [],
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    age_group: '',
    shift: 'MANHA' as 'MANHA' | 'TARDE' | 'INTEGRAL',
    year: new Date().getFullYear(),
    teacherId: '',
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (classItem) {
      setFormData({
        name: classItem.name || '',
        age_group: classItem.age_group || '',
        shift: classItem.shift || 'MANHA',
        year: classItem.year || new Date().getFullYear(),
        teacherId: classItem.teacher ? String(classItem.teacher.id) : '',
      });
    } else {
      setFormData({
        name: '',
        age_group: '',
        shift: 'MANHA',
        year: new Date().getFullYear(),
        teacherId: '',
      });
    }
  }, [classItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age_group) {
      alert('Por favor, preencha pelo menos o nome e a faixa etária');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={classItem ? '✏️ Editar Turma' : '➕ Nova Turma'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nome da Turma"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Ex: Turma A - Educação Infantil"
        />

        <Input
          label="Faixa Etária"
          value={formData.age_group}
          onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
          required
          placeholder="Ex: 4-5 anos"
        />

        <Select
          label="Turno"
          value={formData.shift}
          onChange={(e) =>
            setFormData({ ...formData, shift: e.target.value as 'MANHA' | 'TARDE' | 'INTEGRAL' })
          }
          required
          options={[
            { value: 'MANHA', label: '🌅 Manhã' },
            { value: 'TARDE', label: '🌆 Tarde' },
            { value: 'INTEGRAL', label: '🌞 Integral' },
          ]}
        />

        <Input
          label="Ano Letivo"
          type="number"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
          required
        />

        {teachers.length > 0 && (
          <Select
            label="Professor Responsável"
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            options={[
              { value: '', label: 'Selecione um professor...' },
              ...teachers.map((t) => ({ value: String(t.id), label: t.name })),
            ]}
          />
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            {classItem ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

