export interface Encuesta {
  fecha: Date
  calificacionGeneral: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  calidadComida: 'Excelente' | 'Buena' | 'Regular' | 'Mala'
  tiempoEspera: 'Muy rápido' | 'Rápido' | 'Aceptable' | 'Regular' |  'Lento' |  'Muy lento',
  amabilidadPersonal: 'Muy amable' | 'Amable' | 'Indiferente' | 'Poco amable' | 'Muy poco amable'
  limpieza: Array<string>
  fotos: Array<string>
}