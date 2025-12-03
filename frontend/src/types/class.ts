export interface Class {
  id: number;
  name: string;
  age_group: string;
  shift: 'MANHA' | 'TARDE' | 'INTEGRAL';
  year: number;
  teacher?: {
    id: number;
    name: string;
    email: string;
  };
  students?: Array<{ id: number; name: string }>;
}

