import { Producto } from "./productoMenu.model";
import { Timestamp } from "@angular/fire/firestore";

export interface Pedido{
    fecha:Date|Timestamp;
    mesa:string;
    productos:Producto[];
    cliente:string;
    estado: 'pendiente' | 'rechazado' | 'aceptado' | 'en mesa' | 'finalizado';
    id:string;
    cocina: 'no tiene' | 'en preparacion' | 'listo para servir' | 'entregado';
    bar: 'no tiene' | 'en preparacion' | 'listo para servir' | 'entregado';
    importeTotal: number;
    porcentajePropina: number;
    porcentajeDescuento?: number;
}