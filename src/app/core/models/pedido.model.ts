import { Producto } from "./productoMenu.model";

export interface Pedido{
    mesa:string;
    productos:Producto[];
    cliente:string;
    estado: 'pendiente' | 'rechazado' | 'aceptado';
    id:string;
}