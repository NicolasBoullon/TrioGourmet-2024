import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { addIcons } from 'ionicons';
import { trashBin } from 'ionicons/icons';
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
    IonicModule,
    IonicModule,
  ]
})
export class AsignacionMesaComponent  implements OnInit {

  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);

  protected listaEspera: Usuario[] = [];
  protected mesasDisponibles: Mesa[] = [];

  customSelectOptions = {
    header: 'Seleccionar Mesa',
    message: 'Por favor, elige una mesa de la lista.',
  };
  

  constructor() {
    addIcons({trashBin});
  }

  ngOnInit() {
    this.obtenerListaEspera();
    this.obtenerMesasDisponibles();
  }

  obtenerListaEspera() {
    this._databaseService.getDocument('usuarios').subscribe((usuarios: Usuario[]) => {
      this.listaEspera = usuarios.filter(user => user.estado == 'en lista de espera' && !user.mesa);
    });
    console.log(this.listaEspera)
  }

  obtenerMesasDisponibles() {
    this._databaseService.getDocument('mesas').subscribe((mesas: Mesa[]) => {
      this.mesasDisponibles = mesas.filter(mesa => mesa.estado == 'disponible');
    });
  }

  async asignarMesa(cliente: Usuario, mesa: Mesa) {
    if(mesa) {
      this._notificationService.presentLoading('Asignando mesa...');
      try {
        console.log(cliente);
        await this._databaseService.updateDocument('usuarios', cliente.email, { mesa: mesa.nombre });
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
    else {
      this._notificationService.presentToast('No ha seleccionado ninguna mesa.', 2000, 'warning', 'middle');
    }
  }

  async eliminarDeLaListaDeEspera(cliente: Usuario) {
    this._notificationService.showConfirmWithCancelAlert(
      'Eliminar cliente',
      `¿Seguro que deseas eliminar a ${cliente.name} de la lista de espera?`,
      'Eliminar',
      'Cancelar',
      async () => {
        try {
          await this._databaseService.deleteDocumentField('usuarios', cliente.email, 'estado');
          this._notificationService.presentToast(
            `${cliente.name} eliminado de la lista de espera.`,
            2000,
            'success',
            'middle'
          );
          this.obtenerListaEspera();
        } catch (error) {
          this._notificationService.presentToast(
            'Error al eliminar al cliente, intente nuevamente.',
            2000,
            'danger',
            'middle'
          );
        }
      }
    );
  }
  
  

}
