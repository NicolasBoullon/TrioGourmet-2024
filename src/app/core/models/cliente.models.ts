import { PersonaCredenciales } from "./personaCredenciales.models";

export interface Cliente extends PersonaCredenciales
{
  apellido: string,
  dni: string,
  image: string
}