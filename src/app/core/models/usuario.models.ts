import { Consulta } from "./consulta.model";
import { PersonaCredenciales } from "./personaCredenciales.models";

export interface Usuario extends PersonaCredenciales
{
  apellido: string,
  dni: string,
  image: string,
  estadoAprobacionCuenta: string,
  estado?: 'en lista de espera' | 'mesa asignada' | 'pedido realizado' | 
            'pedido confirmado' | 'pedido terminado' | 'pedido entregado' | 
            'cuenta solicitada' | 'cuenta enviada' | 'cuenta pagada',
  mesa?: string,
  consulta?: Consulta
  realizoEncuesta?: boolean
  recibioElPedido?: boolean;
  idPedidoActual?: string,
}