export interface Student {
  id: number;
  name: string;
  birthDate: string;
  shift: string;
  class?: {
    name: string;
  };
  avatar?: {
    id: number;
    avatar: string;
  };
}