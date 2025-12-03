import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { Note } from '../../types/note';
import type { Class } from '../../types/class';
import type { Student } from '../../types/students';

interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Note>) => Promise<void>;
  note?: Note | null;
  classes?: Class[];
  students?: Student[];
}

export const NoteForm: React.FC<NoteFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  note,
  classes = [],
  students = [],
}) => {
  const [formData, setFormData] = useState({
    classId: '',
    studentId: '',
    disciplina: '',
    data: '',
    nota: '',
  });
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (note) {
      setFormData({
        classId: String(note.classId),
        studentId: String(note.studentId),
        disciplina: note.disciplina,
        data: note.data,
        nota: String(note.nota),
      });
      // Filtrar estudantes da turma selecionada
      const classStudents = students.filter((s) => s.class?.name === note.className);
      setFilteredStudents(classStudents);
    } else {
      setFormData({
        classId: '',
        studentId: '',
        disciplina: '',
        data: new Date().toISOString().split('T')[0],
        nota: '',
      });
      setFilteredStudents([]);
    }
  }, [note, isOpen, students]);

  const handleClassChange = (classId: string) => {
    setFormData({ ...formData, classId, studentId: '' });
    const selectedClass = classes.find((c) => c.id === parseInt(classId));
    if (selectedClass) {
      const classStudents = students.filter((s) => s.class?.name === selectedClass.name);
      setFilteredStudents(classStudents);
    } else {
      setFilteredStudents([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.classId || !formData.studentId || !formData.disciplina || !formData.nota) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const notaValue = parseFloat(formData.nota);
    if (isNaN(notaValue) || notaValue < 0 || notaValue > 10) {
      alert('A nota deve ser um número entre 0 e 10');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        classId: parseInt(formData.classId),
        studentId: parseInt(formData.studentId),
        disciplina: formData.disciplina,
        data: formData.data,
        nota: notaValue,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note ? '✏️ Editar Nota' : '➕ Nova Nota'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <Select
          label="Turma"
          value={formData.classId}
          onChange={(e) => handleClassChange(e.target.value)}
          required
          options={[
            { value: '', label: 'Selecione uma turma...' },
            ...classes.map((c) => ({ value: String(c.id), label: c.name })),
          ]}
        />

        <Select
          label="Aluno"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          required
          disabled={!formData.classId || filteredStudents.length === 0}
          options={[
            { value: '', label: filteredStudents.length === 0 ? 'Selecione uma turma primeiro' : 'Selecione um aluno...' },
            ...filteredStudents.map((s) => ({ value: String(s.id), label: s.name })),
          ]}
        />

        <Input
          label="Disciplina"
          value={formData.disciplina}
          onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
          required
          placeholder="Ex: Matemática"
        />

        <Input
          label="Data"
          type="date"
          value={formData.data}
          onChange={(e) => setFormData({ ...formData, data: e.target.value })}
          required
        />

        <Input
          label="Nota"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={formData.nota}
          onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
          required
          placeholder="0.0 a 10.0"
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            {note ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

