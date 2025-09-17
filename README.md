# GreenCargo Frontend

Sistema de gestión de envíos con seguimiento en tiempo real, optimización de rutas y panel administrativo.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 22.x
- npm o yarn
- Backend de GreenCargo ejecutándose en `http://localhost:3000`

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd greencargo-frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📋 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linter
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (Button, Card, Input, Toast)
│   ├── auth/           # Componentes de autenticación
│   ├── admin/          # Componentes del panel administrativo
│   └── misEnvios/      # Componentes de mis envíos
├── pages/              # Páginas principales
├── services/           # Servicios de API y WebSocket
├── hooks/              # Custom hooks
├── types/              # Definiciones de TypeScript
└── assets/             # Recursos estáticos
```

### Tecnologías Utilizadas
- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Socket.io** - WebSockets para tiempo real
- **Lucide React** - Iconografía

## 🔐 Autenticación

### Endpoints de Backend
- `POST /api/usuarios` - Registro de usuario
- `POST /api/usuarios/login` - Inicio de sesión

### Flujo de Autenticación
1. Login/Registro con validaciones
2. Almacenamiento de JWT en localStorage
3. Interceptores de Axios para incluir token automáticamente
4. Redirección automática a dashboard tras login exitoso
5. Protección de rutas con `ProtectedRoute`

## 🔄 WebSocket y Tiempo Real

### Configuración
```typescript
// Conexión automática al cargar dashboard
const ws = new EnvioWebSocket(token);
await ws.connect();

// Suscripción a actualizaciones
ws.subscribeToEnvio(envioId, (update) => {
  // Actualizar UI automáticamente
});
```

### Eventos Manejados
- `envio_status_update` - Cambios de estado de envíos
- `notification` - Notificaciones generales
- `connect/disconnect` - Estado de conexión

### Notificaciones
- Toast notifications en la aplicación
- Notificaciones nativas del navegador
- Solicitud automática de permisos

## 🎨 Diseño y UX

### Sistema de Colores
- **Verde principal**: `#10B981` (GreenCargo brand)
- **Estados**: Amarillo (espera), Azul (tránsito), Verde (entregado)
- **Grises**: Escala completa para textos y fondos

### Componentes UI
- **Button**: Variantes (primary, secondary, outline, ghost)
- **Card**: Contenedores con sombras y bordes redondeados
- **Input**: Campos con validación y estados de error
- **Toast**: Sistema de notificaciones

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid system adaptativo

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```

### Linting
- ESLint configurado con reglas de React
- TypeScript strict mode
- Prettier para formateo (recomendado)

## 📱 Navegación

### Rutas Públicas
- `/` - Landing page

### Rutas Protegidas
- `/dashboard` - Panel principal del usuario
- `/crear-envio` - Formulario de creación de envíos
- `/admin` - Panel administrativo (solo admins)

### Redirecciones
- Usuarios no autenticados → Landing page
- Usuarios autenticados → Dashboard
- Usuarios no-admin en `/admin` → Dashboard

## 🧪 Testing y Debugging

### Console Logs
- WebSocket: Conexión, eventos, errores
- API: Requests, responses, errores
- Estado: Actualizaciones de componentes

### Herramientas de Desarrollo
- React DevTools
- Redux DevTools (si se implementa Redux)
- Network tab para debugging de API

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Archivos Generados
- `dist/` - Archivos optimizados para producción
- Assets con hash para cache busting
- CSS y JS minificados

---

**GreenCargo** - Sistema de Gestión de Envíos Inteligente 🌱
