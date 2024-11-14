import { Component, inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/core/models/pedido.model';
import { DatabaseService } from 'src/app/core/services/database.service';
import {IonicModule} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-seccion-cocinero',
  templateUrl: './seccion-cocinero.component.html',
  styleUrls: ['./seccion-cocinero.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule,FormsModule]
})
export class SeccionCocineroComponent  implements OnInit {

  constructor() { }
  private databaseService = inject(DatabaseService);
  pedidos:Pedido[] = [];
  pedidosFiltrados:Pedido[] = [];
  pedidosOrdenados:Pedido[] = [];
  subPedidos!:Subscription;
  ngOnInit() {
    this.subPedidos = this.databaseService.getDocument('pedidos').subscribe({
      next:((value)=>{
        this.pedidos = value;
        this.FiltrarPedidos();
      }),
      error:((err)=>{

      })
    })
  }

  esDeCocina(nombreProducto:string):boolean{
    const array = ['Hamburguesa con queso y papas fritas.','Pizza de pepperoni con extra queso.','Empanada argentina de carne.','Helado de vainilla con frutilla y chocolate.']
    for (let i = 0; i < this.pedidosFiltrados.length; i++) {
       if(array.includes(nombreProducto)){
        return true;
       }
    }
    return false;
  }

  FiltrarPedidos(){
    this.pedidosFiltrados = this.pedidos.filter((pedido)=> pedido.estado == 'aceptado' && pedido.cocina == 'en preparacion');
  }

  async PedidoListoParaServir(pedido:Pedido){
    await this.databaseService.updateDocumentField('pedidos',pedido.id,'cocina','listo para servir');
    //enviar push al mozo para decirle que el pedidod en comida esta listo para servir
  }
}
