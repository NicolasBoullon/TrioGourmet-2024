import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { Usuario } from 'src/app/core/models/usuario.models';
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
  ]
})
export class GestionMesasComponent  implements OnInit {
  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);

  protected clientesConMesa: Usuario[] = [];

  ngOnInit() {
    this.obtenerClientesConMesa();
  }

  obtenerClientesConMesa() {
    this._databaseService.getDocument('usuarios').subscribe((usuarios: Usuario[]) => {
      this.clientesConMesa = usuarios.filter(user => user.mesa).sort((a, b) => a.mesa!.localeCompare(b.mesa!));
    });
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

}
