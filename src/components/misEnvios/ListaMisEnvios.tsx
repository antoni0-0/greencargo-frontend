import React from 'react';
import { Package, MapPin, Calendar, Clock, Truck, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MiEnvio } from '../../types/misEnvios';

interface ListaMisEnviosProps {
  envios: MiEnvio[];
  loading?: boolean;
  onVerHistorial: (envio: MiEnvio) => void;
}

export const ListaMisEnvios: React.FC<ListaMisEnviosProps> = ({
  envios,
  loading = false,
  onVerHistorial,
}) => {
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'en espera':
        return 'bg-yellow-100 text-yellow-800';
      case 'en tránsito':
        return 'bg-blue-100 text-blue-800';
      case 'entregado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoProductoIcon = (tipoProducto: string) => {
    switch (tipoProducto.toLowerCase()) {
      case 'electrónicos':
        return '📱';
      case 'ropa y textiles':
        return '👕';
      case 'libros y documentos':
        return '📚';
      case 'alimentos':
        return '🍎';
      case 'cosméticos':
        return '💄';
      case 'herramientas':
        return '🔧';
      case 'juguetes':
        return '🧸';
      case 'deportes':
        return '⚽';
      case 'hogar y jardín':
        return '🏠';
      default:
        return '📦';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'en espera':
        return <Clock className="w-4 h-4" />;
      case 'en tránsito':
        return <Truck className="w-4 h-4" />;
      case 'entregado':
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Cargando tus envíos...</span>
        </div>
      </Card>
    );
  }

  if (envios.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes envíos</h3>
          <p className="text-gray-600">Aún no has creado ningún envío. ¡Crea tu primer envío para comenzar!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {envios.map((envio) => (
        <Card key={envio.id} className="hover:shadow-lg transition-shadow">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{getTipoProductoIcon(envio.tipo_producto)}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Envío #{envio.id}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getEstadoColor(envio.estado.descripcion)}`}>
                      {getEstadoIcon(envio.estado.descripcion)}
                      <span>{envio.estado.descripcion}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{envio.direccion.ciudad}</p>
                        <p className="text-xs">{envio.direccion.direccion}</p>
                        {envio.direccion.detalle && (
                          <p className="text-xs">{envio.direccion.detalle}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Creado</p>
                        <p className="text-xs">
                          {new Date(envio.fecha_creacion).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">Producto</p>
                      <p className="text-xs">{envio.tipo_producto}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Peso</p>
                        <p className="font-medium">{envio.peso} kg</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Volumen</p>
                        <p className="font-medium">{envio.volumen} cm³</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Dimensiones</p>
                        <p className="font-medium">{envio.largo}×{envio.ancho}×{envio.alto}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Estado</p>
                      <p className="font-medium">{envio.estado.descripcion}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => onVerHistorial(envio)}
                className="flex items-center space-x-2"
                variant="outline"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Historial</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
