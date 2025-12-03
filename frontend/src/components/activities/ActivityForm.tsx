import React from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { Activity } from '../../types/activity';
import type { Class } from '../../types/class';

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Activity>) => Promise<void>;
  activity?: Activity | null;
  classes?: Class[];
  bnccCodes?: Array<{ id: number; code: string; name: string; field: string }>;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  activity,
  classes = [],
  bnccCodes = [],
}) => {
  const [formData, setFormData] = React.useState({
    activityCode: '',
    title: '',
    description: '',
    content: '',
    duration: '',
    bnccCodeId: '',
    classId: '',
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (activity) {
      setFormData({
        activityCode: activity.activityCode || '',
        title: activity.title || '',
        description: activity.description || '',
        content: activity.content || '',
        duration: String(activity.duration || ''),
        bnccCodeId: activity.bnccCode ? String(activity.bnccCode) : '',
        classId: activity.class ? String(activity.class) : '',
      });
    } else {
      setFormData({
        activityCode: '',
        title: '',
        description: '',
        content: '',
        duration: '',
        bnccCodeId: '',
        classId: '',
      });
    }
  }, [activity, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.duration) {
      alert('Por favor, preencha pelo menos título, descrição e duração');
      return;
    }

    const durationValue = parseInt(formData.duration);
    if (isNaN(durationValue) || durationValue <= 0) {
      alert('A duração deve ser um número positivo');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        duration: durationValue,
        bnccCodeId: formData.bnccCodeId ? parseInt(formData.bnccCodeId) : undefined,
        classId: formData.classId ? parseInt(formData.classId) : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activity ? '✏️ Editar Atividade' : '➕ Nova Atividade'}
      size="large"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Código da Atividade"
          value={formData.activityCode}
          onChange={(e) => setFormData({ ...formData, activityCode: e.target.value })}
          placeholder="Ex: E101CG01"
          helperText="Formato: E + 3 dígitos + 2 letras + 2 dígitos"
        />

        <Input
          label="Título"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Ex: Circuito Motor"
        />

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            Descrição *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
            placeholder="Descreva a atividade..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e2e8f0',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            Conteúdo (Markdown/Texto)
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            placeholder="Conteúdo completo da atividade em markdown ou texto..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e2e8f0',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <Input
          label="Duração (minutos)"
          type="number"
          min="1"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          required
          placeholder="Ex: 30"
        />

        {bnccCodes.length > 0 && (
          <Select
            label="Código BNCC"
            value={formData.bnccCodeId}
            onChange={(e) => setFormData({ ...formData, bnccCodeId: e.target.value })}
            options={[
              { value: '', label: 'Selecione um código BNCC...' },
              ...bnccCodes.map((code) => ({
                value: String(code.id),
                label: `${code.code} - ${code.name}`,
              })),
            ]}
          />
        )}

        {classes.length > 0 && (
          <Select
            label="Turma (opcional)"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            options={[
              { value: '', label: 'Selecione uma turma...' },
              ...classes.map((c) => ({ value: String(c.id), label: c.name })),
            ]}
          />
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            {activity ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

