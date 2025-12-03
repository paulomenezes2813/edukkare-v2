import React from 'react';
import { useActivities } from '../hooks/useActivities';
import { ActivityList } from '../components/activities/ActivityList';
import { Button } from '../components/common/Button';
import { COLORS } from '../utils/constants';
import type { Activity } from '../types/activity';

export default function Activities() {
  const { activities, loading, error, deleteActivity } = useActivities();

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
          // TODO: Implementar modal de criação de atividade
          alert('Funcionalidade de criação será implementada em breve');
        }}>
          ➕ Nova Atividade
        </Button>
      </div>

      <ActivityList
        activities={activities}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}

