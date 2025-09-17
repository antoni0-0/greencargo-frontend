import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { FiltrosEnviosComponent } from '../components/admin/FiltrosEnvios';
import { ListaEnvios } from '../components/admin/ListaEnvios';
import { ModalAsignarRuta } from '../components/admin/ModalAsignarRuta';
import { envioService } from '../services/api';
import { EnvioConDetalles, FiltrosEnvios, EstadoEnvio } from '../types/ruta';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const { toasts, removeToast, success, showError } = useToast();
  
  const [envios, setEnvios] = useState<EnvioConDetalles[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosEnvios>({ estado: null });
  const [envioSeleccionado, setEnvioSeleccionado] = useState<EnvioConDetalles | null>(null);
  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);

  useEffect(() => {
    if (usuario?.rol !== 'admin') {
      navigate('/dashboard');
      return;
    }
    cargarEnvios();
  }, [usuario, navigate]);

  useEffect(() => {
    cargarEnvios();
  }, [filtros]);

  const cargarEnvios = async () => {
    setLoading(true);
    try {
      const response = await envioService.obtenerEnvios(filtros.estado as EstadoEnvio | undefined);
      
      if (response.success) {
        setEnvios(response.data);
      }
    } catch (error) {
      console.error('Error al cargar envíos:', error);
      showError('Error', 'No se pudieron cargar los envíos');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrosChange = (nuevosFiltros: FiltrosEnvios) => {
    setFiltros(nuevosFiltros);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({ estado: null });
  };

  const handleAsignarRuta = (envio: EnvioConDetalles) => {
    setEnvioSeleccionado(envio);
    setModalAsignarAbierto(true);
  };

  const handleAsignacionExitosa = () => {
    cargarEnvios();
  };

  const handleCerrarModal = () => {
    setModalAsignarAbierto(false);
    setEnvioSeleccionado(null);
  };

  if (usuario?.rol !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta sección.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Dashboard</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Administrador</p>
                <p className="font-medium text-gray-900">{usuario?.nombre}</p>
              </div>
              <Button variant="ghost" onClick={logout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Panel Administrativo
              </h1>
              <p className="text-gray-600">
                Gestiona envíos, asigna rutas y supervisa el sistema de entregas
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={cargarEnvios}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Envíos</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Espera</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Tránsito</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entregados</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>
        </div>

        <FiltrosEnviosComponent
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onLimpiarFiltros={handleLimpiarFiltros}
          loading={loading}
        />

        <ListaEnvios
          envios={envios}
          loading={loading}
          onAsignarRuta={handleAsignarRuta}
        />
      </main>

      <ModalAsignarRuta
        envio={envioSeleccionado}
        isOpen={modalAsignarAbierto}
        onClose={handleCerrarModal}
        onSuccess={handleAsignacionExitosa}
        onErrorToast={showError}
        onSuccessToast={success}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
