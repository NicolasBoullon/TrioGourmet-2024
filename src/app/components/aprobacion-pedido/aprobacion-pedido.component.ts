import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Subscription } from 'rxjs';
import {IonicModule} from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from 'src/app/core/models/pedido.model';
import { Producto } from 'src/app/core/models/productoMenu.model';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { NotificationService } from 'src/app/core/services/notification.service';
@Component({
  selector: 'app-aprobacion-pedido',
  templateUrl: './aprobacion-pedido.component.html',
  styleUrls: ['./aprobacion-pedido.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule,FormsModule]
})
export class AprobacionPedidoComponent  implements OnInit ,OnDestroy{

  private databaseService = inject(DatabaseService);
  private authService = inject(AuthService);
  private database = inject(DatabaseService);
  private apiRequestService = inject(ApiRequestService);
  private notificationService = inject(NotificationService);
  subscribe!: Subscription;
  pedidos:Pedido[] = [];
  pedidosFiltradosPendiente:Pedido[] = [];


  productosListosParaServir:Producto[] = [];

  pedidosAceptados:Pedido[] =[];

  isModalOpen:boolean = false;
  productosCocinaListosParaLlevar:Producto[] = [];

  hayPedidos:boolean = false;
  constructor() { }

  ngOnInit() {
    this.subscribe = this.databaseService.getDocumentsOrderedByDate('pedidos').subscribe({
      next:(resp=>{
        this.pedidos = resp
        this.FiltrarPedidosAceptados();
        this.FiltrarPedidosPendiente();
        // this.FiltrarPedidosListoParaServir();
      }),
      error:(err=>{
        console.log(err);
      })
    })
  }

  CambiarEstadoPedido(accion:boolean,pedido:Pedido){
    if(accion){
      this.databaseService.updateDocumentField('pedidos',pedido.id,'estado','aceptado');
      if(pedido.cocina === 'en preparacion'){
        this.apiRequestService.notifyRole('Nueva comanda', `${pedido.mesa} está esperando para comer.`, 'cocinero').subscribe();
      }
      if(pedido.bar === 'en preparacion'){
        this.apiRequestService.notifyRole('Nueva comanda', `${pedido.mesa} está esperando para beber.`, 'bartender').subscribe();
      }
      // this.notificationService.presentToast('Ha sido aceptado el pedido.', 2000, 'success', 'middle'); //Si o no marino?
    }else{
      this.databaseService.updateDocumentField('pedidos',pedido.id,'estado','rechazado');
    }
  }

  ngOnDestroy() {    
    this.subscribe.unsubscribe();
  }

  FiltrarPedidosPendiente(){
    this.pedidosFiltradosPendiente = this.pedidos.filter((pedido)=> pedido.estado === 'pendiente');
  }

  FiltrarPedidosAceptados(){
    this.pedidosAceptados = this.pedidos.filter((pedido)=> pedido.estado == 'aceptado');
    this.pedidosAceptados.forEach((pedido)=>{
      if(pedido.cocina === 'listo para servir' || pedido.bar === 'listo para servir'){
        this.hayPedidos = true;
      }
    })
  }

  productosListosCocina(pedido:Pedido){
    pedido.productos.forEach(producto => {
      if(producto.sector === 'Comidas' && pedido.cocina === 'listo para servir'){
        this.productosCocinaListosParaLlevar.push(producto);
      }
    });
  }

  EsCocina(producto:Producto){
    
    if(producto.sector === 'Comidas'){
      console.log(producto.sector);
      
      return true;
    }else{
      return false;
    }
  }
  EsBar(producto:Producto){
    
    if(producto.sector === 'Bebidas'){
      console.log(producto.sector);
      
      return true;
    }else{
      return false;
    }
  }

  async LlevarPedido(pedido:Pedido){
    const actualizaciones = [];

    if (pedido) {
      if (pedido.cocina === 'listo para servir') {
        actualizaciones.push(
          this.databaseService.updateDocumentField('pedidos', pedido.id, 'cocina', 'entregado')
            .then(() => {
              pedido.cocina = 'entregado';
            })
        );
      }
  
      if (pedido.bar === 'listo para servir') {
        actualizaciones.push(
          this.databaseService.updateDocumentField('pedidos', pedido.id, 'bar', 'entregado')
            .then(() => {
              pedido.bar = 'entregado';
            })
        );
      }
  
      await Promise.all(actualizaciones);
  
  
      if (pedido.cocina === 'entregado' && pedido.bar === 'entregado') {
        await this.databaseService.updateDocumentField('pedidos', pedido.id, 'estado', 'en mesa');
      }
    }
  }

  OpenModal() {
    if (!this.hayPedidos)
    {
      this.notificationService.presentToast('No hay pedidos para servir', 2000, 'warning', 'bottom');
    }
    else
    {
      this.isModalOpen = true;
    }
  }

  CloseModal(){
    this.isModalOpen = false;
  }
}
