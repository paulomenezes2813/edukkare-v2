import React, { useState } from 'react';
import { useClasses } from '../hooks/useClasses';
import { useTeachers } from '../hooks/useTeachers';
import { ClassList } from '../components/classes/ClassList';
import { ClassForm } from '../components/classes/ClassForm';
import { Button } from '../components/common/Button';
import { COLORS } from '../utils/constants';
import type { Class } from '../types/class';

export default function Classes() {
  const { classes, loading, error, createClass, updateClass, deleteClass } = useClasses();
  const { teachers } = useTeachers();
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const handleSubmit = async (data: Partial<Class>) => {
    if (editingClass) {
      await updateClass(editingClass.id, data);
    } else {
      await createClass(data);
    }
    setShowForm(false);
    setEditingClass(null);
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setShowForm(true);
  };

  const handleDelete = async (classItem: Class) => {
    await deleteClass(classItem.id);
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
          🎒 Turmas
        </h1>
        <Button onClick={() => {
          setEditingClass(null);
          setShowForm(true);
        }}>
          ➕ Nova Turma
        </Button>
      </div>

      <ClassList
        classes={classes}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ClassForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingClass(null);
        }}
        onSubmit={handleSubmit}
        classItem={editingClass}
        teachers={teachers}
      />
    </div>
  );
}

