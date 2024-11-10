import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { Mesa } from 'src/app/core/models/mesa.models';
import { Usuario } from 'src/app/core/models/usuario.models';
import { DatabaseService } from 'src/app/core/services/database.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-asignacion-mesa',
  templateUrl: './asignacion-mesa.component.html',
  styleUrls: ['./asignacion-mesa.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class AsignacionMesaComponent  implements OnInit {

  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);

  protected listaEspera: Usuario[] = [];
  protected mesasDisponibles: Mesa[] = [];

  constructor() { }

  ngOnInit() {
    this.obtenerListaEspera();
    this.obtenerMesasDisponibles();
  }

  obtenerListaEspera() {
    this._databaseService.getDocument('usuarios').subscribe((usuarios: Usuario[]) => {
      this.listaEspera = usuarios.filter(user => user.estado == 'en lista de espera');
    });
  }

  obtenerMesasDisponibles() {
    this._databaseService.getDocument('mesas').subscribe((mesas: Mesa[]) => {
      this.mesasDisponibles = mesas.filter(mesa => mesa.estado == 'disponible');
    });
  }

  async asignarMesa(cliente: Usuario, mesa: Mesa) {
    this._notificationService.presentLoading('Asignando mesa...');
    try {
      console.log(cliente);
      await this._databaseService.updateDocument('usuarios', cliente.email, { estado: 'mesa asignada', mesa: mesa.nombre });
      await this._databaseService.updateDocument('mesas', mesa.nombre, { estado: 'ocupada', cliente: cliente.email });

      this._notificationService.dismissLoading();
      this._notificationService.presentToast(`${mesa.nombre} asignada a ${cliente.name}`, 2000, 'success', 'middle');
      
      this.obtenerListaEspera();
      this.obtenerMesasDisponibles();
    } 
    catch {
      this._notificationService.dismissLoading();
      this._notificationService.presentToast('Error al asignar la mesa, intente nuevamente.', 2000, 'danger', 'middle');
    }
  }

}
