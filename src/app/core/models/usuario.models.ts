import { Consulta } from "./consulta.model";
import { PersonaCredenciales } from "./personaCredenciales.models";

export interface Usuario extends PersonaCredenciales
{
  apellido: string,
  dni: string,
  image: string,
  estadoAprobacionCuenta: string,
  estado?: string,
  mesa?: string,
  lecturaMesa?: boolean
  consulta?: Consulta
}