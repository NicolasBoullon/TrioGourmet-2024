import { Producto } from "./productoMenu.model";
import { Timestamp } from "@angular/fire/firestore";

export interface Pedido{
    fecha:Date|Timestamp;
    mesa:string;
    productos:Producto[];
    cliente:string;
    estado: 'pendiente' | 'rechazado' | 'aceptado' | 'en mesa'; // | 'en mesa'
    id:string;
    cocina: 'no tiene' | 'en preparacion' | 'listo para servir' | 'entregado' ;// | rechazado?
    bar: 'no tiene' | 'en preparacion' | 'listo para servir' | 'entregado'; // rechazado?
    importeTotal: number;
    porcentajePropina: number;
}