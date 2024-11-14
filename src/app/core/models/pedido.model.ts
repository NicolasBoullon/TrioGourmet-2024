import { Producto } from "./productoMenu.model";
import { Timestamp } from "@angular/fire/firestore";

export interface Pedido{
    fecha:Date|Timestamp;
    mesa:string;
    productos:Producto[];
    cliente:string;
    estado: 'pendiente' | 'rechazado' | 'aceptado';
    id:string;
    cocina: 'no tiene' | 'en preparacion' | 'listo para servir';
    bar: 'no tiene' | 'en preparacion' | 'listo para servir';
}