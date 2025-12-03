export interface Student {
  id: number;
  name: string;
  birthDate: string;
  shift: string;
  responsavel?: string;
  telefone?: string;
  email?: string;
  class?: {
    name: string;
  };
  avatar?: {
    id: number;
    avatar: string;
  };
}