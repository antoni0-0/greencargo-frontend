import React, { useState, useEffect } from 'react';
import { X, Package, MapPin, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MiEnvio, HistorialItem } from '../../types/misEnvios';
import { envioService } from '../../services/api';

interface ModalHistorialProps {
  envio: MiEnvio | null;
  isOpen: boolean;
  onClose: () => void;
  onErrorToast?: (title: string, message?: string) => void;
}

export const ModalHistorial: React.FC<ModalHistorialProps> = ({
  envio,
  isOpen,
  onClose,
  onErrorToast,
}) => {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && envio) {
      cargarHistorial();
    }
  }, [isOpen, envio]);

  const cargarHistorial = async () => {
    if (!envio) return;
    
    setLoading(true);
    try {
      const response = await envioService.obtenerHistorialEnvio(envio.id);
      
      if (response.success) {
        setHistorial(response.data.historial);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
      onErrorToast?.('Error', 'No se pudo cargar el historial del envío');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'en espera':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'en tránsito':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'entregado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'en espera':
        return 'bg-yellow-50 border-yellow-200';
      case 'en tránsito':
        return 'bg-blue-50 border-blue-200';
      case 'entregado':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return {
      fecha: date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      hora: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (!isOpen || !envio) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Historial del Envío</h2>
              <p className="text-sm text-gray-600">Envío #{envio.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <Card className="mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Información del Envío</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Producto: <span className="font-medium">{envio.tipo_producto}</span></p>
                    <p className="text-gray-600">Peso: <span className="font-medium">{envio.peso} kg</span></p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Destino: <span className="font-medium">{envio.direccion.ciudad}</span></p>
                      <p className="text-xs text-gray-500">{envio.direccion.direccion}</p>
                      {envio.direccion.detalle && (
                        <p className="text-xs text-gray-500">{envio.direccion.detalle}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Estados</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600">Cargando historial...</span>
              </div>
            ) : historial.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay historial disponible para este envío.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {historial.map((item, index) => {
                  const { fecha, hora } = formatFecha(item.fecha_cambio);
                  const isLast = index === historial.length - 1;
                  
                  return (
                    <div key={item.id} className="relative">
                      {!isLast && (
                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                      )}
                      
                      <div className={`flex items-start space-x-4 p-4 rounded-lg border ${getEstadoColor(item.estado.descripcion)}`}>
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                            {getEstadoIcon(item.estado.descripcion)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900">
                              {item.estado.descripcion}
                            </h4>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{fecha}</p>
                              <p className="text-xs text-gray-500">{hora}</p>
                            </div>
                          </div>
                          
                          {item.comentario && (
                            <p className="text-sm text-gray-600">{item.comentario}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
