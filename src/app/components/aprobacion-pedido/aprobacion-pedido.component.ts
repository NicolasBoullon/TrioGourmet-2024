import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Subscription } from 'rxjs';
import {IonicModule} from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from 'src/app/core/models/pedido.model';
import { Producto } from 'src/app/core/models/productoMenu.model';
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
  
  subscribe!: Subscription;
  pedidos:Pedido[] = [];
  pedidosFiltradosPendiente:Pedido[] = [];


  productosListosParaServir:Producto[] = [];

  pedidosAceptados:Pedido[] =[];

  isModalOpen:boolean = false;
  productosCocinaListosParaLlevar:Producto[] = [];
  constructor() { }

  ngOnInit() {
    this.subscribe = this.databaseService.getDocument('pedidos').subscribe({
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

  OpenModal(){
    this.isModalOpen = true;
  }

  CloseModal(){
    this.isModalOpen = false;
  }
}
