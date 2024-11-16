export interface Consulta {
  id?: string,
  mesa: string
  consulta: string,
  respuesta?: string,
  fecha: Date
  mailMozo?: string
  mailCliente?: string
  respondida: boolean
}