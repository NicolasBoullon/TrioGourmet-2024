import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Subscription } from 'rxjs';
import {IonicModule} from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from 'src/app/core/models/pedido.model';
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
  pedidosFiltrados:Pedido[] = [];
  constructor() { }

  ngOnInit() {
    this.subscribe = this.databaseService.getDocument('pedidos').subscribe({
      next:(resp=>{
        this.pedidos = resp
        this.FiltrarPedidos();
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
    console.log('hola');
    
    this.subscribe.unsubscribe();
  }

  FiltrarPedidos(){
    this.pedidosFiltrados = this.pedidos.filter((pedido)=> pedido.estado == 'pendiente');
  }

}
