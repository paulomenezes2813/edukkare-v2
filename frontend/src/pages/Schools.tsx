import React, { useState } from 'react';
import { useSchools } from '../hooks/useSchools';
import { SchoolList } from '../components/schools/SchoolList';
import { SchoolForm } from '../components/schools/SchoolForm';
import { Button } from '../components/common/Button';
import { COLORS } from '../utils/constants';
import type { School } from '../types/school';

export default function Schools() {
  const { schools, loading, error, createSchool, updateSchool, deleteSchool } = useSchools();
  const [showForm, setShowForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const handleSubmit = async (data: Partial<School>) => {
    if (editingSchool) {
      await updateSchool(editingSchool.id, data);
    } else {
      await createSchool(data);
    }
    setShowForm(false);
    setEditingSchool(null);
  };

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setShowForm(true);
  };

  const handleDelete = async (school: School) => {
    await deleteSchool(school.id);
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
          🏫 Escolas
        </h1>
        <Button onClick={() => {
          setEditingSchool(null);
          setShowForm(true);
        }}>
          ➕ Nova Escola
        </Button>
      </div>

      <SchoolList
        schools={schools}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SchoolForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingSchool(null);
        }}
        onSubmit={handleSubmit}
        school={editingSchool}
      />
    </div>
  );
}

