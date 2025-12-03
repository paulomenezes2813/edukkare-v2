import React, { useState } from 'react';
import { useActivities } from '../hooks/useActivities';
import { useClasses } from '../hooks/useClasses';
import { ActivityList } from '../components/activities/ActivityList';
import { ActivityForm } from '../components/activities/ActivityForm';
import { Button } from '../components/common/Button';
import { COLORS } from '../utils/constants';
import type { Activity } from '../types/activity';

export default function Activities() {
  const { activities, loading, error, createActivity, updateActivity, deleteActivity } = useActivities();
  const { classes } = useClasses();
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const handleSubmit = async (data: Partial<Activity>) => {
    if (editingActivity) {
      await updateActivity(editingActivity.id, data);
    } else {
      await createActivity(data);
    }
    setShowForm(false);
    setEditingActivity(null);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDelete = async (activity: Activity) => {
    await deleteActivity(activity.id);
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
          📚 Atividades
        </h1>
        <Button onClick={() => {
          setEditingActivity(null);
          setShowForm(true);
        }}>
          ➕ Nova Atividade
        </Button>
      </div>

      <ActivityList
        activities={activities}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ActivityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingActivity(null);
        }}
        onSubmit={handleSubmit}
        activity={editingActivity}
        classes={classes}
      />
    </div>
  );
}

