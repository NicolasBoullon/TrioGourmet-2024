import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/core/models/pedido.model';
import { DatabaseService } from 'src/app/core/services/database.service';
import {IonicModule} from '@ionic/angular';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { NotificationService } from 'src/app/core/services/notification.service';
@Component({
  selector: 'app-seccion-bartender',
  templateUrl: './seccion-bartender.component.html',
  styleUrls: ['./seccion-bartender.component.scss'],
  standalone:true,
  imports:[IonicModule,FormsModule,CommonModule]
})
export class SeccionBartenderComponent  implements OnInit , OnDestroy{

  constructor() { }
  private databaseService = inject(DatabaseService);
  private apiRequestService = inject(ApiRequestService);
  private notificationService = inject(NotificationService);
  pedidos:Pedido[] = [];
  pedidosFiltrados:Pedido[] = [];
  pedidosOrdenados:Pedido[] = [];
  subPedidos!:Subscription;
  ngOnInit() {
    this.subPedidos = this.databaseService.getDocumentsOrderedByDate('pedidos').subscribe({
      next:((value)=>{
        this.pedidos = value;
        this.FiltrarPedidos();
      }),
      error:((err)=>{

      })
    })
  }

  esDeBar(nombreProducto:string):boolean{
    const array = ['Botella de agua mineral.','Limonada fresca con menta.'];
    for (let i = 0; i < this.pedidosFiltrados.length; i++) {
       if(array.includes(nombreProducto)){
        return true;
       }
    }
    return false;
  }

  FiltrarPedidos(){
    this.pedidosFiltrados = this.pedidos.filter((pedido)=> pedido.estado == 'aceptado' && pedido.bar == 'en preparacion');
  }

  async PedidoListoParaServir(pedido:Pedido){
    await this.databaseService.updateDocumentField('pedidos',pedido.id,'bar','listo para servir');
    this.apiRequestService.notifyRole('Tienes una bebida esperandote', `${pedido.mesa} está listo para servir.`, 'mozo').subscribe();
    await this.notificationService.presentToast('Pedido enviado al mozo',1000,'success','bottom');

    if(pedido.cocina === 'listo para servir') {
      await this.databaseService.updateDocumentField('usuarios', pedido.cliente, 'estado', 'pedido terminado');
    }
  }

  ConvertirTimeStamp(fecha:any){
    const date  =  new Date(fecha * 1000);
    return formatDate(date,'HH:mm', 'en-Us');
  }
  ngOnDestroy(): void {
    this.subPedidos.unsubscribe();
  }
}
