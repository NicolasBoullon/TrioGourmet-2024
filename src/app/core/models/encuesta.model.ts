export interface Encuesta {
  fecha: Date,
  clienteEmail?: string,
  calificacionGeneral: number
  calidadComida: string
  tiempoEspera: string,
  amabilidadPersonal: string
  limpieza: Array<boolean> 
  fotos: Array<string>
}