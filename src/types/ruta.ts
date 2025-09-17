export interface Vehiculo {
  id: number;
  placa: string;
  tipo: 'camion' | 'furgon' | 'moto' | 'bicicleta';
  capacidad: number;
}

export interface Transportista {
  id: number;
  disponibilidad: boolean;
  vehiculo: Vehiculo;
}

export interface Ruta {
  id: number;
  descripcion: string;
  fecha_hora_inicio: string;
  estado: 'planificada' | 'en_progreso' | 'completada' | 'cancelada';
}

export interface AsignacionRuta {
  id: number;
  id_envio: number;
  id_ruta: number;
  id_transportista: number;
  fecha_asignacion: string;
  envio: {
    id: number;
    peso: number;
    volumen: number;
    tipo_producto: string;
    estado: string;
  };
  ruta: Ruta;
  transportista: Transportista;
}

export interface AsignacionRutaRequest {
  id_envio: number;
  id_ruta: number;
  id_transportista: number;
}

export interface AsignacionRutaResponse {
  success: boolean;
  message: string;
  data: AsignacionRuta;
}

export interface EnvioConDetalles {
  id: number;
  id_usuario: number;
  id_direccion: number;
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

export interface EnviosResponse {
  success: boolean;
  message: string;
  data: EnvioConDetalles[];
  filters: {
    estado: number;
  };
}

export interface FiltrosEnvios {
  estado: number | null;
}

export type EstadoEnvio = 0 | 1 | 2; 
