import { inject, Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { DatabaseService } from './database.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from './notification.service';
import { Usuario } from '../models/usuario.models';
import { ApiRequestService } from './api-request.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SeleccionarPropinaComponent } from 'src/app/components/seleccionar-propina/seleccionar-propina.component';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);
  private _apiRequestService = inject(ApiRequestService); 
  private _router = inject(Router);
  private _modalController = inject(ModalController);

  async scanQR(correo: string): Promise<void>
  {
    const clienteDoc: Usuario = await firstValueFrom(
      this._databaseService.getDocumentById('usuarios', correo)
    );

    if (clienteDoc.estado == 'pedido entregado' && !clienteDoc.recibioElPedido) {
      this._notificationService.presentToast('Debe confirmar la recepción del pedido.', 2000, 'warning', 'bottom');
    }
    else {
      // const { barcodes } = await BarcodeScanner.scan();
      // const scannedQR = barcodes[0].rawValue;
      let scannedQR = 'cuenta enviada';

      if (!scannedQR) return;
  
      if (scannedQR == 'solicitar mesa') {
        if (!clienteDoc.estado) {
          try {
            await this._databaseService.updateDocumentField('usuarios', correo, 'estado', 'en lista de espera');
            this._notificationService.presentToast('Ha sido cargado en la lista de espera.', 2000, 'success', 'bottom');
            this._apiRequestService.notifyRole(`Cliente en lista de espera`, `${clienteDoc.name} ${clienteDoc.apellido ? clienteDoc.apellido + ' ' : '' }se encuentra a la espera de asignación de una mesa. Únase para gestionar la solicitud.`, 'maitre').subscribe();
          }
          catch {
            this._notificationService.presentToast('Error al agregarlo a la lista de espera. Intente nuevamente.', 2000, 'danger', 'bottom');
          }
        }
        else if (clienteDoc.estado == 'en lista de espera') {
          if(clienteDoc.mesa) {
            this._notificationService.presentToast('Ya le asignaron una mesa, no puede volver a la lista de espera.', 2000, 'danger', 'bottom');
          }
          else {
            this._notificationService.presentToast('Ya se encuentra en la lista de espera. Por favor aguarde a ser atendido.', 2000, 'warning', 'bottom');
          }
        }
        else {
          this._notificationService.presentToast('Ya tiene una mesa asignada, no puede volver a la lista de espera.', 2000, 'danger', 'bottom');
        }
      }
      else if (scannedQR == 'Mesa 1' || scannedQR == 'Mesa 2' || scannedQR == 'Mesa 3') {
  
        if (clienteDoc.mesa) {
          if (clienteDoc.mesa == scannedQR) {
  
            if (clienteDoc.estado == 'en lista de espera') {
              await this._databaseService.updateDocumentField('usuarios', correo, 'estado', 'mesa asignada');
              this._notificationService.presentToast(`Acceso permitido a la ${scannedQR}.`, 2000, 'success', 'bottom');
            }
            else if (clienteDoc.estado == 'mesa asignada') {
              this._notificationService.routerLink("/menu");
            }
            else if (clienteDoc.estado == 'pedido realizado') {
              this._router.navigate(['/opciones-escaneo'], {
                queryParams: { estado: 'pedido realizado' },
              });
            }
            else if (clienteDoc.estado == 'pedido confirmado') {
              this._router.navigate(['/opciones-escaneo'], {
                queryParams: { estado: 'pedido confirmado' },
              });
            }
            else if (clienteDoc.estado == 'pedido terminado') {
              this._router.navigate(['/opciones-escaneo'], {
                queryParams: { estado: 'pedido terminado' },
              });
            }
            else if (clienteDoc.estado == 'pedido entregado') {
              this._router.navigate(['/opciones-escaneo'], {
                queryParams: { estado: 'pedido entregado' },
              });
            }
            else if (clienteDoc.estado == 'cuenta solicitada') {
              this._router.navigate(['/opciones-escaneo'], {
                queryParams: { estado: 'cuenta solicitada' },
              });
            }
            else if (clienteDoc.estado == 'cuenta enviada') {
              this._router.navigate(['/opciones-escaneo'], {
                queryParams: { estado: 'cuenta enviada' },
              });
            }
            else if (clienteDoc.estado == 'cuenta pagada') {
              this._router.navigate(['/opciones-escaneo'], {
                queryParams: { estado: 'cuenta pagada' },
              });
            }
          } else {
            this._notificationService.presentToast(`Acceso denegado. Usted tiene asignada la ${clienteDoc.mesa}.`, 2000, 'danger', 'bottom');
          }
        }
        else if (clienteDoc.estado == 'en lista de espera') {
          this._notificationService.presentToast('Debe esperar a que el maitre le asigne una mesa.', 2000, 'warning', 'bottom');
        }
        else {
          this._notificationService.presentToast('Debe estar en la lista de espera antes de asignarse a una mesa.', 2000, 'danger', 'bottom');
        }
      }
      else if (scannedQR == 'propinas') {
        if (clienteDoc.estado == 'cuenta enviada') {
          const modalPropina = await this._modalController.create({
            component: SeleccionarPropinaComponent,
            componentProps: {
              idPedido: clienteDoc.idPedidoActual,
            },
            cssClass: 'custom-modal-class',
          });

          await modalPropina.present();
          await modalPropina.onDidDismiss();
        }
        else {
          this._notificationService.presentToast('El mozo debe enviarle la cuenta antes de poder ingresar la propina.', 2000, 'danger', 'bottom');
        }
      }
      else {
        this._notificationService.presentToast('Codigo QR no valido.', 2000, 'danger', 'bottom');
      }
    }
  }

}
