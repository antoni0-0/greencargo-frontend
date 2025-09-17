import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { ListaMisEnvios } from '../components/misEnvios/ListaMisEnvios';
import { ModalHistorial } from '../components/misEnvios/ModalHistorial';
import { envioService } from '../services/api';
import { getWebSocketInstance, clearWebSocketInstance, EnvioWebSocket } from '../services/websocket';
import { MiEnvio, WebSocketUpdate, WebSocketNotification } from '../types/misEnvios';
import { Package, Truck, MapPin, User, Plus, Settings, RefreshCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { usuario, logout, token } = useAuth();
  const navigate = useNavigate();
  const { toasts, removeToast, success, showError } = useToast();
  
  const [misEnvios, setMisEnvios] = useState<MiEnvio[]>([]);
  const [loadingEnvios, setLoadingEnvios] = useState(false);
  const [envioSeleccionado, setEnvioSeleccionado] = useState<MiEnvio | null>(null);
  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);

  useEffect(() => {
    if (usuario && token) {
      cargarMisEnvios();
      inicializarWebSocket();
      solicitarPermisosNotificacion();
    }
    
    return () => {
      clearWebSocketInstance();
    };
  }, [usuario, token]);

  const solicitarPermisosNotificacion = async () => {
    try {
      const granted = await EnvioWebSocket.requestNotificationPermission();
      if (granted) {
        console.log('Permisos de notificación concedidos');
      } else {
        console.log('Permisos de notificación denegados');
      }
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
    }
  };

  const cargarMisEnvios = async () => {
    setLoadingEnvios(true);
    try {
      const response = await envioService.obtenerMisEnvios();
      
      if (response.success) {
        setMisEnvios(response.data);
      }
    } catch (error) {
      console.error('Error al cargar mis envíos:', error);
      showError('Error', 'No se pudieron cargar tus envíos');
    } finally {
      setLoadingEnvios(false);
    }
  };

  const inicializarWebSocket = async () => {
    if (!token) return;

    try {
      const ws = getWebSocketInstance(token);
      if (ws) {
        await ws.connect();
        
        ws.setNotificationCallback((notification: WebSocketNotification) => {
          if (notification.tipo === 'envio_update') {
            success('Actualización de Envío', notification.mensaje);
            
            EnvioWebSocket.showBrowserNotification(
              'GreenCargo - Actualización de Envío',
              notification.mensaje
            );
            
            cargarMisEnvios();
          }
        });

        misEnvios.forEach(envio => {
          ws.subscribeToEnvio(envio.id, (update: WebSocketUpdate) => {
            setMisEnvios(prev => prev.map(e => 
              e.id === update.envioId 
                ? { ...e, estado: update.estadoNuevo }
                : e
            ));
          });
        });
      }
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
    }
  };

  const handleVerHistorial = (envio: MiEnvio) => {
    setEnvioSeleccionado(envio);
    setModalHistorialAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalHistorialAbierto(false);
    setEnvioSeleccionado(null);
  };

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">GreenCargo</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Bienvenido,</p>
                <p className="font-medium text-gray-900">{usuario.nombre}</p>
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
                Panel de Control
              </h1>
              <p className="text-gray-600">
                Gestiona tus envíos y accede a todas las funcionalidades de GreenCargo
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => navigate('/crear-envio')}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Envío</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={cargarMisEnvios}
                disabled={loadingEnvios}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loadingEnvios ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </Button>
              
              {usuario?.rol === 'admin' && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Panel Admin</span>
                </Button>
              )}
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
                <p className="text-sm font-medium text-gray-600">Envíos Totales</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Tránsito</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <MapPin className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entregados</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Perfil</p>
                <p className="text-2xl font-bold text-gray-900">{usuario.rol}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mis Envíos</h2>
            <div className="text-sm text-gray-600">
              {misEnvios.length} envío{misEnvios.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <ListaMisEnvios
            envios={misEnvios}
            loading={loadingEnvios}
            onVerHistorial={handleVerHistorial}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información del Usuario
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre:</span>
                <span className="font-medium">{usuario.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{usuario.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rol:</span>
                <span className="font-medium capitalize">{usuario.rol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Miembro desde:</span>
                <span className="font-medium">
                  {new Date(usuario.fecha_registro).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <ModalHistorial
        envio={envioSeleccionado}
        isOpen={modalHistorialAbierto}
        onClose={handleCerrarModal}
        onErrorToast={showError}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
