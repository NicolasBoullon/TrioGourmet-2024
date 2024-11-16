export interface Consulta {
  mesa: string
  consulta: string,
  respuesta?: string,
  fecha: Date
  mailMozo?: string
  mailCliente?: string
  respondida: boolean
}