export interface Usuario {
  idUsuario?: number;
  nombreUsuario: string;
  contraseña: string;
  email?: string;
  fechaRegistro?: Date;
  ultimoAcceso?: Date;
  activo?: boolean;
}