export interface Direccion {
  direccion: string;
  detalle?: string;
  ciudad: string;
  departamento: string;
  codigo_postal: string;
  pais: string;
}

export interface EnvioRequest {
  direccion: Direccion;
  peso: number;
  largo: number;
  ancho: number;
  alto: number;
  tipo_producto: string;
}

export interface Envio {
  id: number;
  usuario_id: number;
  direccion: Direccion;
  peso: number;
  largo: number;
  ancho: number;
  alto: number;
  tipo_producto: string;
  estado: 'pendiente' | 'en_transito' | 'entregado' | 'cancelado';
  fecha_creacion: string;
  fecha_actualizacion: string;
  costo?: number;
}

export interface EnvioResponse {
  success: boolean;
  message: string;
  data: Envio;
}

export interface EnvioFormData {
  direccion: Direccion;
  peso: string;
  largo: string;
  ancho: string;
  alto: string;
  tipo_producto: string;
}

export interface EnvioFormErrors {
  direccion?: {
    direccion?: string;
    ciudad?: string;
    departamento?: string;
    codigo_postal?: string;
    pais?: string;
  };
  peso?: string;
  largo?: string;
  ancho?: string;
  alto?: string;
  tipo_producto?: string;
  general?: string;
}
