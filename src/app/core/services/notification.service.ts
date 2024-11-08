import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController  } from '@ionic/angular';
import { Haptics } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  private _loadingController = inject(LoadingController);
  private _toastController = inject(ToastController);
  private _alertController = inject(AlertController);
  private _router = inject(Router);

  async presentLoading(message: string = 'Cargando...', duration: number = 0): Promise<void> {
    const loading = await this._loadingController.create({
      message,
      cssClass: 'spinner-logo-loading',
      spinner: null,
    });
    await loading.present();

    // Esperar un tiempo antes de permitir que el loading se cierre
    if (duration > 0) {
      await new Promise(resolve => setTimeout(resolve, duration));
    }
  }

  async dismissLoading(): Promise<void> {
    await this._loadingController.dismiss();
  }

  async presentToast(message: string, duration: number, color: string, position: 'top' | 'middle' | 'bottom'): Promise<void> {
    if (color == 'danger')
      Haptics.vibrate({ duration: duration }); 

    const toast = await this._toastController.create({
      message,
      duration,
      color,
      position
    });
    
    await toast.present();
  }

  async showConfirmAlert(title: string, message: string, confirmButtonText: string, onConfirm: () => void): Promise<void> {
    const alert = await this._alertController.create({
      header: title,
      message,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: confirmButtonText,
          handler: () => {
            onConfirm();
          }
        },
      ],
      backdropDismiss: false
    });
    await alert.present();
  }
  
  routerLink(url: string) {
    return this._router.navigateByUrl(url);
  }
}
