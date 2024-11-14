export interface Producto {
  nombre: string;
  imagenes: string[];
  precio: number;
  descripcion: string;
  tiempoPreparacion: number;
  cantidad: number;
  selected: boolean;
  sector: 'Comidas' | 'Bebidas';
}