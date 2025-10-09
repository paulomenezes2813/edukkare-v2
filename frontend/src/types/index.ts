export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'GESTOR' | 'COORDENADOR' | 'PROFESSOR';
  active: boolean;
  createdAt: string;
}

export interface Student {
  id: number;
  name: string;
  birthDate: string;
  responsavel: string;
  telefone: string;
  email?: string;
  shift: 'MANHA' | 'TARDE' | 'INTEGRAL';
  active: boolean;
  classId: number;
  class?: Class;
}

export interface Class {
  id: number;
  name: string;
  ageGroup: string;
  shift: string;
  capacity: number;
}

export interface Evaluation {
  id: number;
  studentId: number;
  activityId: number;
  bnccCodeId: number;
  level: 'NAO_REALIZOU' | 'PARCIALMENTE' | 'REALIZOU';
  percentage: number;
  observations?: string;
  date: string;
  student?: Student;
  activity?: Activity;
  bnccCode?: BNCCCode;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  field: string;
}

export interface BNCCCode {
  id: number;
  code: string;
  description: string;
  field: string;
  ageGroup: string;
}

export interface Evidence {
  id: number;
  type: 'FOTO' | 'AUDIO' | 'VIDEO' | 'NOTA';
  url: string;
  studentId: number;
  transcription?: string;
  aiAnalysis?: string;
}

export interface DashboardMetrics {
  totalStudents: number;
  totalEvaluations: number;
  totalEvidences: number;
  bnccCoverage: number;
  weeklyActivities: number;
  avgDevelopment: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

