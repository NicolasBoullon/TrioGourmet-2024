import { inject, Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { DatabaseService } from './database.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from './notification.service';
import { Usuario } from '../models/usuario.models';
import { ApiRequestService } from './api-request.service';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);
  private _apiRequestService = inject(ApiRequestService); 

  async scanQR(correo: string): Promise<void>
  {
    const { barcodes } = await BarcodeScanner.scan();
    const scannedQR = barcodes[0].rawValue;

    if (!scannedQR) return;

    const clienteDoc: Usuario = await firstValueFrom(
      this._databaseService.getDocumentById('usuarios', correo)
    );
    
    if (scannedQR == 'solicitar mesa') {
      if (!clienteDoc.estado) {
        try {
          await this._databaseService.updateDocumentField('usuarios', correo, 'estado', 'en lista de espera');
          this._notificationService.presentToast('Ha sido cargado en la lista de espera.', 2000, 'success', 'middle');
          this._apiRequestService.notifyRole(`Cliente en lista de espera`, `${clienteDoc.name} ${clienteDoc.apellido} se encuentra a la espera de asignación de una mesa. Únase para gestionar la solicitud.`, 'maitre').subscribe();
        }
        catch {
          this._notificationService.presentToast('Error al agregarlo a la lista de espera. Intente nuevamente.', 2000, 'danger', 'middle');
        }
      }
      else if (clienteDoc.estado == 'en lista de espera') {
        this._notificationService.presentToast('Ya se encuentra en la lista de espera. Por favor aguarde a ser atendido.', 2000, 'warning', 'middle');
      }
      else {
        this._notificationService.presentToast('Ya tiene una mesa asignada, no puede volver a la lista de espera.', 2000, 'danger', 'middle');
      }
    }
    else if (scannedQR == 'Mesa 1' || scannedQR == 'Mesa 2' || scannedQR == 'Mesa 3') {

      if (clienteDoc.estado == 'mesa asignada') {
        if (clienteDoc.mesa == scannedQR) {

          this._notificationService.presentToast(`Acceso permitido a la ${scannedQR}.`, 2000, 'success', 'middle');
          
          // ACA HAY QUE VER QUE COMO ES EL QR DE SU MESA LE APAREZCA EL CHAT, MENU, ETC

        } else {
          this._notificationService.presentToast(`Acceso denegado. Usted tiene asignada la ${clienteDoc.mesa}.`, 2000, 'danger', 'middle');
        }
      }
      else if (clienteDoc.estado == 'en lista de espera') {
        this._notificationService.presentToast('Debe esperar a que el maitre le asigne una mesa.', 2000, 'warning', 'middle');
      }
      else {
        this._notificationService.presentToast('Debe estar en la lista de espera antes de asignarse a una mesa.', 2000, 'danger', 'middle');
      }
    }
    else {
      this._notificationService.presentToast('Codigo QR no valido.', 2000, 'danger', 'middle');
    }
  }
}
