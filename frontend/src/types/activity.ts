export interface ActivityDocument {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  description?: string;
  createdAt: string;
  uploadedBy?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Activity {
  id: number;
  activityCode?: string;
  title: string;
  description: string;
  content?: string;
  documentationPath?: string; // Mantido para compatibilidade
  duration: number;
  bnccCode?: {
    code: string;
    name: string;
    field: string;
  };
  rubrics?: Rubric[];
  documents?: ActivityDocument[];
}

export interface Rubric {
  id: number;
  rubricCode: string;
  name: string;
  description: string;
  activityCode: string;
  activityId: number;
  levels: {
    excelente: { title: string; description: string; stars: number };
    satisfatorio: { title: string; description: string; stars: number };
    desenvolvimento: { title: string; description: string; stars: number };
    iniciante: { title: string; description: string; stars: number };
  };
  criteria?: string;
  active: boolean;
  activity?: {
    id: number;
    activityCode?: string;
    title: string;
  };
}

