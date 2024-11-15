import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/core/models/pedido.model';
import { DatabaseService } from 'src/app/core/services/database.service';
import {IonicModule} from '@ionic/angular';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { NotificationService } from 'src/app/core/services/notification.service';
@Component({
  selector: 'app-seccion-cocinero',
  templateUrl: './seccion-cocinero.component.html',
  styleUrls: ['./seccion-cocinero.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule,FormsModule]
})
export class SeccionCocineroComponent  implements OnInit , OnDestroy{

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
    this.apiRequestService.notifyRole('Tienes una comida esperandote', `${pedido.mesa} está listo para servir.`, 'mozo').subscribe();
    await this.notificationService.presentToast('Pedido enviado al mozo',1000,'succes','bottom');
  }
   
  ConvertirTimeStamp(fecha:any){
    const date  =  new Date(fecha * 1000);
    return formatDate(date,'HH:mm', 'en-Us');
  }
  ngOnDestroy(): void {
    this.subPedidos.unsubscribe();
  }
}
