import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from "@ionic/angular";
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
  protected isModalLlevarPedidoOpen: boolean = false;

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


  async enviarCuenta(cliente: Usuario) {
    this._notificationService.presentLoading('Enviando cuenta...');
    try {
      await this._databaseService.updateDocument('usuarios', cliente.email, { estado: 'cuenta enviada' });
      this._notificationService.dismissLoading();
      this._notificationService.presentToast(`Cuenta enviada a ${cliente.mesa}`, 2000, 'success', 'middle');
    } 
    catch {
      this._notificationService.dismissLoading();
      this._notificationService.presentToast('Error al enviar la cuenta, intente nuevamente.', 2000, 'danger', 'middle');
    }
  }

  cerrarModalLlevarPedido() {
    this.isModalLlevarPedidoOpen = false;
    this.pedidoSeleccionado = undefined;
  }

  async llevarPedido(idPedido: string) {
    this.pedidoSeleccionado = await firstValueFrom(this._databaseService.getDocumentById('pedidos', idPedido));
    if (this.pedidoSeleccionado) {
      this.isModalLlevarPedidoOpen = true;
    } else {
      this._notificationService.presentToast('Pedido no encontrado.', 2000, 'warning', 'bottom');
    }
  }

  async confirmarLlevarPedido(pedido: Pedido) {
    try {
      const actualizaciones: Promise<void>[] = [];

      if (pedido.cocina === 'listo para servir') {
        actualizaciones.push(
          this._databaseService.updateDocumentField('pedidos', pedido.id, 'cocina', 'entregado')
        );
      }

      if (pedido.bar === 'listo para servir') {
        actualizaciones.push(
          this._databaseService.updateDocumentField('pedidos', pedido.id, 'bar', 'entregado')
        );
      }

      await Promise.all(actualizaciones);

      // Si ambos sectores están entregados, actualizamos el estado general
      if (pedido.cocina === 'entregado' && pedido.bar === 'entregado') {
        await this._databaseService.updateDocumentField('pedidos', pedido.id, 'estado', 'en mesa');
        await this._databaseService.updateDocumentField('usuarios', pedido.cliente, 'estado', 'pedido entregado');
      }

      this._notificationService.presentToast('Pedido entregado a la mesa.', 2000, 'success', 'bottom');
      this.cerrarModalLlevarPedido();
    } catch (err) {
      this._notificationService.presentToast('Error al llevar el pedido, intente nuevamente.', 2000, 'danger', 'bottom');
    }
  }


}
