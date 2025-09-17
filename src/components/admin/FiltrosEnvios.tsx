import React from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FiltrosEnvios, EstadoEnvio } from '../../types/ruta';

interface FiltrosEnviosProps {
  filtros: FiltrosEnvios;
  onFiltrosChange: (filtros: FiltrosEnvios) => void;
  onLimpiarFiltros: () => void;
  loading?: boolean;
}

export const FiltrosEnviosComponent: React.FC<FiltrosEnviosProps> = ({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
  loading = false,
}) => {
  const estados = [
    { value: null, label: 'Todos los estados' },
    { value: 0, label: 'En espera' },
    { value: 1, label: 'En tránsito' },
    { value: 2, label: 'Entregado' },
  ];

  const handleEstadoChange = (estado: EstadoEnvio | null) => {
    onFiltrosChange({ ...filtros, estado });
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado del Envío
          </label>
          <select
            value={filtros.estado ?? ''}
            onChange={(e) => {
              const value = e.target.value === '' ? null : parseInt(e.target.value) as EstadoEnvio;
              handleEstadoChange(value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
          >
            {estados.map((estado) => (
              <option key={estado.value ?? 'all'} value={estado.value ?? ''}>
                {estado.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end space-x-2">
          <Button
            variant="outline"
            onClick={onLimpiarFiltros}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Limpiar</span>
          </Button>
        </div>
      </div>

      {(filtros.estado !== null) && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-700">Filtros activos:</span>
              {filtros.estado !== null && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Estado: {estados.find(e => e.value === filtros.estado)?.label}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
