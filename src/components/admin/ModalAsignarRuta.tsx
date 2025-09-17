import React, { useState, useEffect } from 'react';
import { X, Truck, Route, User, Package, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EnvioConDetalles, Ruta, Transportista, AsignacionRutaRequest } from '../../types/ruta';
import { rutaService } from '../../services/api';

interface ModalAsignarRutaProps {
  envio: EnvioConDetalles | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (asignacion: any) => void;
  onErrorToast?: (title: string, message?: string) => void;
  onSuccessToast?: (title: string, message?: string) => void;
}

export const ModalAsignarRuta: React.FC<ModalAsignarRutaProps> = ({
  envio,
  isOpen,
  onClose,
  onSuccess,
  onErrorToast,
  onSuccessToast,
}) => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [selectedRuta, setSelectedRuta] = useState<number | null>(null);
  const [selectedTransportista, setSelectedTransportista] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen && envio) {
      loadData();
    }
  }, [isOpen, envio]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [rutasResponse, transportistasResponse] = await Promise.all([
        rutaService.obtenerRutasDisponibles(),
        rutaService.obtenerTransportistas(),
      ]);

      if (rutasResponse.success) {
        setRutas(rutasResponse.data);
      }

      if (transportistasResponse.success) {
        setTransportistas(transportistasResponse.data.filter(t => t.disponibilidad));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      onErrorToast?.('Error', 'No se pudieron cargar las rutas y transportistas');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!envio || !selectedRuta || !selectedTransportista) {
      onErrorToast?.('Error', 'Por favor selecciona una ruta y un transportista');
      return;
    }

    setLoading(true);
    try {
      const asignacionData: AsignacionRutaRequest = {
        id_envio: envio.id,
        id_ruta: selectedRuta,
        id_transportista: selectedTransportista,
      };

      const response = await rutaService.asignarRuta(asignacionData);
      
      if (response.success) {
        onSuccessToast?.(
          '¡Ruta asignada exitosamente!',
          `El envío #${envio.id} ha sido asignado a la ruta y transportista seleccionados`
        );
        onSuccess(response.data);
        handleClose();
      }
    } catch (error: any) {
      console.error('Error al asignar ruta:', error);
      const errorMessage = error.response?.data?.message || 'Error al asignar la ruta. Inténtalo de nuevo.';
      onErrorToast?.('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRuta(null);
    setSelectedTransportista(null);
    onClose();
  };

  const getTipoVehiculoIcon = (tipo: string) => {
    switch (tipo) {
      case 'camion':
        return '🚛';
      case 'furgon':
        return '🚐';
      case 'moto':
        return '🏍️';
      case 'bicicleta':
        return '🚲';
      default:
        return '🚗';
    }
  };

  if (!isOpen || !envio) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Asignar Ruta</h2>
              <p className="text-sm text-gray-600">Envío #{envio.id}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
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
                    <p className="text-gray-600">Cliente: <span className="font-medium">{envio.usuario.nombre}</span></p>
                    <p className="text-gray-600">Destino: <span className="font-medium">{envio.direccion.ciudad}</span></p>
                  </div>
                  <div>
                    <p className="text-gray-600">Peso: <span className="font-medium">{envio.peso} kg</span></p>
                    <p className="text-gray-600">Tipo: <span className="font-medium">{envio.tipo_producto}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600">Cargando opciones...</span>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Route className="w-4 h-4 inline mr-2" />
                    Seleccionar Ruta
                  </label>
                  <select
                    value={selectedRuta || ''}
                    onChange={(e) => setSelectedRuta(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona una ruta</option>
                    {rutas.map((ruta) => (
                      <option key={ruta.id} value={ruta.id}>
                        {ruta.descripcion} - {new Date(ruta.fecha_hora_inicio).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Seleccionar Transportista
                  </label>
                  <select
                    value={selectedTransportista || ''}
                    onChange={(e) => setSelectedTransportista(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona un transportista</option>
                    {transportistas.map((transportista) => (
                      <option key={transportista.id} value={transportista.id}>
                        {getTipoVehiculoIcon(transportista.vehiculo.tipo)} {transportista.vehiculo.placa} - 
                        {transportista.vehiculo.tipo} (Capacidad: {transportista.vehiculo.capacidad} kg)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedRuta && selectedTransportista && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Verificación de Compatibilidad</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          El envío de {envio.peso} kg será asignado al transportista seleccionado.
                          {envio.peso > transportistas.find(t => t.id === selectedTransportista)?.vehiculo.capacidad! && (
                            <span className="text-red-600 font-medium"> ⚠️ El peso excede la capacidad del vehículo.</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                className="flex-1"
                loading={loading}
                disabled={loading || loadingData || !selectedRuta || !selectedTransportista}
              >
                {loading ? 'Asignando...' : 'Asignar Ruta'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
