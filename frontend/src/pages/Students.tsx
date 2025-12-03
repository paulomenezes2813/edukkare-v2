import React, { useState } from 'react';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';
import { StudentList } from '../components/students/StudentList';
import { StudentForm } from '../components/students/StudentForm';
import { Button } from '../components/common/Button';
import { COLORS } from '../utils/constants';
import type { Student } from '../types/students';

export default function Students() {
  const { students, loading, error, createStudent, updateStudent, deleteStudent } = useStudents();
  const { classes } = useClasses();
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleSubmit = async (data: Partial<Student>) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, data);
    } else {
      await createStudent(data);
    }
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (student: Student) => {
    await deleteStudent(student.id);
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
          👶 Alunos
        </h1>
        <Button onClick={() => {
          setEditingStudent(null);
          setShowForm(true);
        }}>
          ➕ Novo Aluno
        </Button>
      </div>

      <StudentList
        students={students}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <StudentForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingStudent(null);
        }}
        onSubmit={handleSubmit}
        student={editingStudent}
        classes={classes}
      />
    </div>
  );
}

