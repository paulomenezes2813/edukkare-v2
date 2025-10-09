export type User = {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  
  export type AuthResponse = {
    token: string;
    user: User;
  };