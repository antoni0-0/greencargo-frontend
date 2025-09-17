export interface MiEnvio {
  id: number;
  id_usuario: number;
  id_estado_actual: number;
  peso: number;
  largo: number;
  ancho: number;
  alto: number;
  volumen: number;
  tipo_producto: string;
  fecha_creacion: string;
  direccion: {
    id: number;
    direccion: string;
    detalle?: string;
    ciudad: string;
    departamento: string;
    codigo_postal: string;
    pais: string;
  };
  estado: {
    id: number;
    descripcion: string;
  };
  usuario: {
    id: number;
    nombre: string;
    email: string;
  };
}

export interface MisEnviosResponse {
  success: boolean;
  message: string;
  data: MiEnvio[];
}

export interface HistorialItem {
  id: number;
  id_envio: number;
  id_estado: number;
  fecha_cambio: string;
  comentario: string;
  estado: {
    id: number;
    descripcion: string;
  };
}

export interface HistorialResponse {
  success: boolean;
  message: string;
  data: {
    envio: {
      id: number;
      tipo_producto: string;
      peso: number;
      direccion: {
        id: number;
        direccion: string;
        detalle?: string;
        ciudad: string;
        departamento: string;
        codigo_postal: string;
        pais: string;
      };
    };
    historial: HistorialItem[];
  };
}

export interface WebSocketUpdate {
  envioId: number;
  estadoAnterior: {
    id: number;
    descripcion: string;
  };
  estadoNuevo: {
    id: number;
    descripcion: string;
  };
  fechaCambio: string;
  comentario: string;
  mensaje: string;
}

export interface WebSocketNotification {
  tipo: 'envio_update' | 'general' | 'system';
  titulo: string;
  mensaje: string;
  envioId?: number;
  timestamp: string;
}
