export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  nivelAcesso?: string;
  active: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}