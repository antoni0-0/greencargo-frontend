import React, { useState } from 'react';
import { MapPin, Package, Ruler, Weight, Truck, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { envioService } from '../../services/api';
import { EnvioFormData, EnvioFormErrors, EnvioRequest } from '../../types/envio';

interface EnvioFormProps {
  onSuccess?: (envio: any) => void;
  onCancel?: () => void;
  onSuccessToast?: (title: string, message?: string) => void;
  onErrorToast?: (title: string, message?: string) => void;
}

export const EnvioForm: React.FC<EnvioFormProps> = ({ onSuccess, onCancel, onSuccessToast, onErrorToast }) => {
  const [formData, setFormData] = useState<EnvioFormData>({
    direccion: {
      direccion: '',
      detalle: '',
      ciudad: '',
      departamento: '',
      codigo_postal: '',
      pais: 'Colombia',
    },
    peso: '',
    largo: '',
    ancho: '',
    alto: '',
    tipo_producto: '',
  });

  const [errors, setErrors] = useState<EnvioFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const tiposProducto = [
    'Electrónicos',
    'Ropa y Textiles',
    'Libros y Documentos',
    'Alimentos',
    'Cosméticos',
    'Herramientas',
    'Juguetes',
    'Deportes',
    'Hogar y Jardín',
    'Otros',
  ];

  const departamentos = [
    'Antioquia',
    'Atlántico',
    'Bogotá D.C.',
    'Bolívar',
    'Boyacá',
    'Caldas',
    'Caquetá',
    'Cauca',
    'Cesar',
    'Córdoba',
    'Cundinamarca',
    'Huila',
    'La Guajira',
    'Magdalena',
    'Meta',
    'Nariño',
    'Norte de Santander',
    'Quindío',
    'Risaralda',
    'Santander',
    'Sucre',
    'Tolima',
    'Valle del Cauca',
    'Vaupés',
    'Vichada',
  ];

  const validateForm = (): boolean => {
    const newErrors: EnvioFormErrors = {};

    if (!formData.direccion.direccion.trim()) {
      newErrors.direccion = { ...newErrors.direccion, direccion: 'La dirección es requerida' };
    }

    if (!formData.direccion.ciudad.trim()) {
      newErrors.direccion = { ...newErrors.direccion, ciudad: 'La ciudad es requerida' };
    }

    if (!formData.direccion.departamento.trim()) {
      newErrors.direccion = { ...newErrors.direccion, departamento: 'El departamento es requerido' };
    }

    if (!formData.direccion.codigo_postal.trim()) {
      newErrors.direccion = { ...newErrors.direccion, codigo_postal: 'El código postal es requerido' };
    }

    const peso = parseFloat(formData.peso);
    if (!formData.peso || isNaN(peso) || peso <= 0) {
      newErrors.peso = 'El peso debe ser un número mayor a 0';
    } else if (peso > 50) {
      newErrors.peso = 'El peso no puede exceder 50 kg';
    }

    const largo = parseFloat(formData.largo);
    if (!formData.largo || isNaN(largo) || largo <= 0) {
      newErrors.largo = 'El largo debe ser un número mayor a 0';
    } else if (largo > 200) {
      newErrors.largo = 'El largo no puede exceder 200 cm';
    }

    const ancho = parseFloat(formData.ancho);
    if (!formData.ancho || isNaN(ancho) || ancho <= 0) {
      newErrors.ancho = 'El ancho debe ser un número mayor a 0';
    } else if (ancho > 200) {
      newErrors.ancho = 'El ancho no puede exceder 200 cm';
    }

    const alto = parseFloat(formData.alto);
    if (!formData.alto || isNaN(alto) || alto <= 0) {
      newErrors.alto = 'El alto debe ser un número mayor a 0';
    } else if (alto > 200) {
      newErrors.alto = 'El alto no puede exceder 200 cm';
    }

    if (!formData.tipo_producto.trim()) {
      newErrors.tipo_producto = 'El tipo de producto es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      onErrorToast?.('Error de validación', 'Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setIsLoading(true);
      
      const envioData: EnvioRequest = {
        direccion: formData.direccion,
        peso: parseFloat(formData.peso),
        largo: parseFloat(formData.largo),
        ancho: parseFloat(formData.ancho),
        alto: parseFloat(formData.alto),
        tipo_producto: formData.tipo_producto,
      };

      const response = await envioService.crearEnvio(envioData);
      
      if (response.success) {
        onSuccessToast?.(
          '¡Envío creado exitosamente!',
          `Tu envío ha sido registrado con el código ${response.data.id || 'N/A'}`
        );
        
        setFormData({
          direccion: {
            direccion: '',
            detalle: '',
            ciudad: '',
            departamento: '',
            codigo_postal: '',
            pais: 'Colombia',
          },
          peso: '',
          largo: '',
          ancho: '',
          alto: '',
          tipo_producto: '',
        });
        
        onSuccess?.(response.data);
      }
    } catch (error: any) {
      console.error('Error al crear envío:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el envío. Inténtalo de nuevo.';
      onErrorToast?.('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('direccion.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (name.startsWith('direccion.')) {
      const field = name.split('.')[1];
      if (errors.direccion?.[field as keyof typeof errors.direccion]) {
        setErrors(prev => ({
          ...prev,
          direccion: {
            ...prev.direccion,
            [field]: undefined,
          },
        }));
      }
    } else if (errors[name as keyof EnvioFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Nuevo Envío</h2>
        <p className="text-gray-600">Completa la información para registrar tu envío</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {errors.general}
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Dirección de Destino</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Dirección *"
                name="direccion.direccion"
                value={formData.direccion.direccion}
                onChange={handleChange}
                error={errors.direccion?.direccion}
                icon={<MapPin size={18} />}
                placeholder="Calle 85 #11-42"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Detalle adicional"
                name="direccion.detalle"
                value={formData.direccion.detalle}
                onChange={handleChange}
                placeholder="Apartamento 502, Torre A (opcional)"
              />
            </div>

            <Input
              label="Ciudad *"
              name="direccion.ciudad"
              value={formData.direccion.ciudad}
              onChange={handleChange}
              error={errors.direccion?.ciudad}
              placeholder="Bogotá"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <select
                name="direccion.departamento"
                value={formData.direccion.departamento}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.direccion?.departamento 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Selecciona un departamento</option>
                {departamentos.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.direccion?.departamento && (
                <p className="mt-1 text-sm text-red-600">{errors.direccion.departamento}</p>
              )}
            </div>

            <Input
              label="Código Postal *"
              name="direccion.codigo_postal"
              value={formData.direccion.codigo_postal}
              onChange={handleChange}
              error={errors.direccion?.codigo_postal}
              placeholder="110221"
            />

            <Input
              label="País"
              name="direccion.pais"
              value={formData.direccion.pais}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Ruler className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Dimensiones y Peso</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              label="Peso (kg) *"
              name="peso"
              type="number"
              step="0.1"
              min="0.1"
              max="50"
              value={formData.peso}
              onChange={handleChange}
              error={errors.peso}
              icon={<Weight size={18} />}
              placeholder="3.5"
            />

            <Input
              label="Largo (cm) *"
              name="largo"
              type="number"
              step="0.1"
              min="1"
              max="200"
              value={formData.largo}
              onChange={handleChange}
              error={errors.largo}
              icon={<Ruler size={18} />}
              placeholder="40"
            />

            <Input
              label="Ancho (cm) *"
              name="ancho"
              type="number"
              step="0.1"
              min="1"
              max="200"
              value={formData.ancho}
              onChange={handleChange}
              error={errors.ancho}
              icon={<Ruler size={18} />}
              placeholder="30"
            />

            <Input
              label="Alto (cm) *"
              name="alto"
              type="number"
              step="0.1"
              min="1"
              max="200"
              value={formData.alto}
              onChange={handleChange}
              error={errors.alto}
              icon={<Ruler size={18} />}
              placeholder="20"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Truck className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Información del Producto</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Producto *
            </label>
            <select
              name="tipo_producto"
              value={formData.tipo_producto}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.tipo_producto 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Selecciona el tipo de producto</option>
              {tiposProducto.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            {errors.tipo_producto && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo_producto}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            className="flex-1"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creando Envío...' : 'Crear Envío'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
