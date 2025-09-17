import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse, RegisterResponse } from '../types/auth';
import { EnvioRequest, EnvioResponse } from '../types/envio';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/usuarios/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },
};

export const envioService = {
  crearEnvio: async (data: EnvioRequest): Promise<EnvioResponse> => {
    const response = await api.post('/envios', data);
    return response.data;
  },
};

export default api;
