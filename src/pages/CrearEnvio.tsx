import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EnvioForm } from '../components/envios/EnvioForm';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';

export const CrearEnvio: React.FC = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, success, showError } = useToast();

  const handleSuccess = (envio: any) => {
    // Redirigir al dashboard después de crear el envío exitosamente
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">GreenCargo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Crear Nuevo Envío
              </h1>
              <p className="text-gray-600">
                Completa la información para registrar tu envío y comenzar el proceso de entrega
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={() => showError('Prueba de Error', 'Este es un toast de prueba')}
                className="text-sm"
              >
                Probar Toast Error
              </Button>
            </div>
          </div>
        </div>

        {/* Formulario de Envío */}
        <EnvioForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel}
          onSuccessToast={success}
          onErrorToast={showError}
        />
      </main>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
