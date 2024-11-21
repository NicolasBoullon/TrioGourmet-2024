import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/core/services/database.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-seleccionar-propina',
  templateUrl: './seleccionar-propina.component.html',
  styleUrls: ['./seleccionar-propina.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule,FormsModule]
})
export class SeleccionarPropinaComponent {

  @Input() idPedido!: string;
  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);
  private _modalController = inject(ModalController);
  protected porcentajeSeleccionado: number | null = null; 

  async confirmar() {
    this._modalController.dismiss();
    try {
      await this._databaseService.updateDocumentField('pedidos', this.idPedido, 'porcentajePropina', this.porcentajeSeleccionado);
      console.log(`Propina guardada para el pedido ${this.idPedido}`);
      this._notificationService.presentToast(`Has seleccionado una propina de ${this.porcentajeSeleccionado}%.`, 2000, 'success', 'middle');
    } catch (error) {
      this._notificationService.presentToast('Ocurrió un error al seleccionar la propina. Intente de nuevo.', 2000, 'danger', 'middle');
    }
  }

  close() {
    this._modalController.dismiss();
  }
}
