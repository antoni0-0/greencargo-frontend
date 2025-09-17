export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'cliente' | 'admin' | 'repartidor';
  fecha_registro: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  rol: 'cliente' | 'admin' | 'repartidor';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    usuario: Usuario;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: Usuario;
}

export interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
