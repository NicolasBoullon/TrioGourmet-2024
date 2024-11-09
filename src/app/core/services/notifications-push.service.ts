import { inject, Injectable } from '@angular/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { Usuario } from '../models/usuario.models';
import { User } from '@angular/fire/auth';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsPushService {

  private user?: User;
  private enable: boolean = false;
  private _databaseService = inject(DatabaseService); 
    
  constructor() { }

  init(user: User)
  {
    this.user = user;
    console.log('Initializing NotificationsPushService');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result:any) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        this.addListener();
      } else {
        alert('Error, debes habilitar las notificaciones!');
      }
    });

    
  }

  private addListener()
  {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      this.saveToken(token.value);
      this.enable = true;
      // alert('Push registration success, token: ' + token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      // alert('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      // alert('Push received: ' + JSON.stringify(notification));
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      // alert('Push action performed: ' + JSON.stringify(notification));
    });
  }

  private async saveToken(token: string)
  {
    console.log('saveToken -> ', token);
    await this._databaseService.updateDocumentField('usuarios', this.user?.email!, 'token', token);
    console.log('saved token');
  }

  async deleteToken()
  {
    if (this.enable)
    {
      await this._databaseService.updateDocumentField('usuarios', this.user?.email!, 'token', null);
    }
  }
}
