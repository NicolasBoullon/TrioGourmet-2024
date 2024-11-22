import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from "@ionic/angular";
import { addIcons } from 'ionicons';
import { closeCircleOutline, handRightSharp } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { Pedido } from 'src/app/core/models/pedido.model';
import { Usuario } from 'src/app/core/models/usuario.models';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DatabaseService } from 'src/app/core/services/database.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-gestion-mesas',
  templateUrl: './gestion-mesas.component.html',
  styleUrls: ['./gestion-mesas.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    IonicModule,
    RouterLink
  ]
})
export class GestionMesasComponent  implements OnInit {
  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);
  private _apiRequestService = inject(ApiRequestService);

  protected clientesConMesa: Usuario[] = [];
  protected pedidoSeleccionado?: Pedido;
  protected isModalVerPedidoOpen: boolean = false;
  protected isModalVerPedidoParaLlevar: boolean = false;

  constructor()
  {
    addIcons({handRightSharp, closeCircleOutline}); 
  }

  ngOnInit() {
    this.obtenerClientesConMesa();
  }

  obtenerClientesConMesa() {
    this._databaseService.getDocument('usuarios').subscribe((usuarios: Usuario[]) => {
      this.clientesConMesa = usuarios.filter(user => user.mesa).sort((a, b) => a.mesa!.localeCompare(b.mesa!));
    });
  }

  async verPedido(idPedido: string) {
    this.pedidoSeleccionado = await firstValueFrom(this._databaseService.getDocumentById('pedidos', idPedido));
    if (this.pedidoSeleccionado) {
      this.isModalVerPedidoOpen = true;
    } 
    else {
      this._notificationService.presentToast('Pedido no encontrado.', 2000, 'warning', 'bottom');
    }
  }

  cerrarModalVerPedido() {
    this.isModalVerPedidoOpen = false;
    this.pedidoSeleccionado = undefined;
  }

  async aceptarPedido(pedido: Pedido) {
    this.cerrarModalVerPedido();
    try {
      await this._databaseService.updateDocumentField('pedidos', pedido.id, 'estado', 'aceptado');
      await this._databaseService.updateDocumentField('usuarios', pedido.cliente, 'estado', 'pedido confirmado');
      if(pedido.cocina === 'en preparacion'){
        this._apiRequestService.notifyRole('Nueva comanda', `${pedido.mesa} está esperando para comer.`, 'cocinero').subscribe();
      }
      if(pedido.bar === 'en preparacion'){
        this._apiRequestService.notifyRole('Nueva comanda', `${pedido.mesa} está esperando para beber.`, 'bartender').subscribe();
      }
      this._notificationService.presentToast(`Pedido aceptado.`, 2000, 'success', 'bottom');
    }
    catch {
      this._notificationService.presentToast(`Ocurrió un error al aceptar el pedido. Intente de nuevo`, 2000, 'danger', 'bottom');
    }
  }

  async rechazarPedido(pedido: Pedido) {
    this.cerrarModalVerPedido();
    try {
      await this._databaseService.updateDocumentField('usuarios', pedido.cliente, 'estado', 'mesa asignada');
      await this._databaseService.deleteDocumentField('usuarios', pedido.cliente, 'idPedidoActual');
      await this._databaseService.updateDocumentField('pedidos', pedido.id, 'estado', 'rechazado');
      this._notificationService.presentToast(`Pedido rechazado.`, 2000, 'warning', 'bottom');
    }
    catch {
      this._notificationService.presentToast(`Ocurrió un error al rechazar el pedido. Intente de nuevo`, 2000, 'danger', 'bottom');
    }
  }

  async verPedidoParaLlevar(idPedido: string) {
    this.pedidoSeleccionado = await firstValueFrom(this._databaseService.getDocumentById('pedidos', idPedido));
    if (this.pedidoSeleccionado) {
      this.isModalVerPedidoParaLlevar = true;
    } else {
      this._notificationService.presentToast('Pedido no encontrado.', 2000, 'warning', 'bottom');
    }
  }
  
  cerrarModalVerPedidoParaLlevar() {
    this.isModalVerPedidoParaLlevar = false;
    this.pedidoSeleccionado = undefined;
  }

  async llevarPedido(pedido: Pedido) {
    this.cerrarModalVerPedidoParaLlevar();
    try {
      if (pedido.cocina == 'listo para servir' && pedido.bar == 'listo para servir') {
        await this._databaseService.updateDocument('pedidos', pedido.id, {cocina: 'entregado', bar: 'entregado', estado: 'en mesa'});
        await this._databaseService.updateDocumentField('usuarios', pedido.cliente, 'estado', 'pedido entregado');
        this._notificationService.presentToast(`Pedido entregado a ${pedido.mesa}.`, 2000, 'success', 'bottom');
      }
      else {
        this._notificationService.presentToast('El pedido aun no está listo para llevar.', 2000, 'warning', 'bottom');
      }
    }
    catch (err) {
      this._notificationService.presentToast('Error al llevar el pedido, intente nuevamente.', 2000, 'danger', 'bottom');
    }
  }

  async enviarCuenta(cliente: Usuario) {
    this._notificationService.presentLoading('Enviando cuenta...');
    try {
      await this._databaseService.updateDocument('usuarios', cliente.email, { estado: 'cuenta enviada' });
      this._notificationService.dismissLoading();
      this._notificationService.presentToast(`Cuenta enviada a ${cliente.mesa}`, 2000, 'success', 'bottom');
    } 
    catch {
      this._notificationService.dismissLoading();
      this._notificationService.presentToast('Error al enviar la cuenta, intente nuevamente.', 2000, 'danger', 'bottom');
    }
  }

  async liberarMesa(cliente: Usuario) {
    this._notificationService.presentLoading('Liberando mesa...');
    try {
      await this._databaseService.deleteDocumentField('mesas', cliente.mesa!, 'cliente');
      await this._databaseService.updateDocumentField('mesas', cliente.mesa!, 'estado', 'disponible');
      await this._databaseService.deleteDocumentField('usuarios', cliente.email, 'estado');
      await this._databaseService.deleteDocumentField('usuarios', cliente.email, 'mesa');
      await this._databaseService.deleteDocumentField('usuarios', cliente.email, 'consulta');
      await this._databaseService.deleteDocumentField('usuarios', cliente.email, 'realizoEncuesta');
      await this._databaseService.deleteDocumentField('usuarios', cliente.email, 'recibioElPedido');
      await this._databaseService.deleteDocumentField('usuarios', cliente.email, 'idPedidoActual');
      this._notificationService.dismissLoading();
      this._notificationService.presentToast(`${cliente.mesa} liberada con exito.`, 2000, 'success', 'bottom');
    } 
    catch {
      this._notificationService.dismissLoading();
      this._notificationService.presentToast('Error al liberar la mesa, intente nuevamente.', 2000, 'danger', 'bottom');
    }
  }


}
