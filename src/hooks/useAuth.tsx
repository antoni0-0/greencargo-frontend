import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Usuario, AuthContextType, RegisterRequest } from '../types/auth';
import { authService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsuario = localStorage.getItem('usuario');

    if (storedToken && storedUsuario) {
      setToken(storedToken);
      setUsuario(JSON.parse(storedUsuario));
      navigate('/dashboard');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      
      if (response.success) {
        const { token: newToken, usuario: newUsuario } = response.data;
        
        setToken(newToken);
        setUsuario(newUsuario);
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('usuario', JSON.stringify(newUsuario));
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      
      if (error.response?.status === 401) {
        setToken(null);
        setUsuario(null);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await authService.register(data);
      
      if (response.success) {
        await login(data.email, data.password);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const value: AuthContextType = {
    usuario,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!usuario,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
