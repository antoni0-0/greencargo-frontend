import React, { useState } from 'react';
import { Truck, MapPin, Clock, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';

export const LandingPage: React.FC = () => {
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
  const { toasts, removeToast } = useToast();

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-green-600" />,
      title: "Envíos Rápidos",
      description: "Entregas en tiempo récord con nuestra red de repartidores optimizada"
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: "Rastreo en Tiempo Real",
      description: "Sigue tu paquete en tiempo real desde el origen hasta el destino"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Seguro y Confiable",
      description: "Tus envíos están protegidos con nuestro sistema de seguridad avanzado"
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Disponible 24/7",
      description: "Servicio disponible las 24 horas del día, los 7 días de la semana"
    }
  ];

  const stats = [
    { number: "10K+", label: "Envíos Completados" },
    { number: "500+", label: "Ciudades Cubiertas" },
    { number: "99.9%", label: "Tasa de Éxito" },
    { number: "24/7", label: "Soporte Disponible" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">GreenCargo</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Características</a>
              <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors">Acerca de</a>
              <a href="#contact" className="text-gray-600 hover:text-green-600 transition-colors">Contacto</a>
            </nav>

            <div className="flex space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowAuth('login')}
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => setShowAuth('register')}
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Envíos Inteligentes,
              <span className="text-green-600"> Entregas Verdes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Optimizamos rutas, reducimos emisiones y garantizamos entregas rápidas. 
              Únete a la revolución del transporte sostenible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setShowAuth('register')}
                className="flex items-center space-x-2"
              >
                <span>Comenzar Ahora</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAuth('login')}
              >
                Rastrear Envío
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir GreenCargo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnología avanzada y compromiso ambiental para un servicio de envíos excepcional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya confían en GreenCargo para sus envíos
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowAuth('register')}
          >
            Crear Cuenta Gratis
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">GreenCargo</span>
              </div>
              <p className="text-gray-400">
                Envíos inteligentes y sostenibles para un futuro mejor.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Envíos Nacionales</li>
                <li>Envíos Internacionales</li>
                <li>Envíos Express</li>
                <li>Envíos Frágiles</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Acerca de Nosotros</li>
                <li>Carreras</li>
                <li>Prensa</li>
                <li>Sostenibilidad</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Centro de Ayuda</li>
                <li>Contacto</li>
                <li>Estado del Servicio</li>
                <li>Política de Privacidad</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GreenCargo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative">
            <button
              onClick={() => setShowAuth(null)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
            {showAuth === 'login' ? (
              <LoginForm onSwitchToRegister={() => setShowAuth('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setShowAuth('login')} />
            )}
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
