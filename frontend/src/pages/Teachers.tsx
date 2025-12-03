import React, { useState } from 'react';
import { useTeachers } from '../hooks/useTeachers';
import { TeacherList } from '../components/teachers/TeacherList';
import { TeacherForm } from '../components/teachers/TeacherForm';
import { Button } from '../components/common/Button';
import { COLORS } from '../utils/constants';
import type { Teacher } from '../types/teacher';

export default function Teachers() {
  const { teachers, loading, error, createTeacher, updateTeacher, deleteTeacher } = useTeachers();
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const handleSubmit = async (data: Partial<Teacher>) => {
    if (editingTeacher) {
      await updateTeacher(editingTeacher.id, data);
    } else {
      await createTeacher(data);
    }
    setShowForm(false);
    setEditingTeacher(null);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleDelete = async (teacher: Teacher) => {
    await deleteTeacher(teacher.id);
  };

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: COLORS.error }}>❌ {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          👩‍🏫 Professores
        </h1>
        <Button onClick={() => {
          setEditingTeacher(null);
          setShowForm(true);
        }}>
          ➕ Novo Professor
        </Button>
      </div>

      <TeacherList
        teachers={teachers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TeacherForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTeacher(null);
        }}
        onSubmit={handleSubmit}
        teacher={editingTeacher}
      />
    </div>
  );
}

