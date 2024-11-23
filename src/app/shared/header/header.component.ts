import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonHeader,
    IonButtons,
    IonBackButton,
    IonToolbar,
    IonTitle,
    IonButton,
  ],
})
export class HeaderComponent implements OnInit {
  private _authService = inject(AuthService);
  private _notificationService = inject(NotificationService);

  @Input() title: string = '';
  @Input() backButton: string | null = null;
  @Input() showSignOut: boolean = false;

  constructor() {
    addIcons({ logOutOutline });
  }

  ngOnInit() {}

  reproducirAudioSalir() {
    const audio = new Audio('../../assets/audio/salir.mp3');
    audio.load();
    audio.play();
  }

  async signOut() {
    await this._notificationService.presentLoading('Cerrando sesión...', 2000);
    try {
      await this._authService.signOut();
      this.reproducirAudioSalir();
      this._notificationService.routerLink('/login');
    } catch (error) {
      await this._notificationService.presentToast(
        '¡Error: No se pudo cerrar sesión!',
        1000,
        'danger',
        'bottom'
      );
    } finally {
      await this._notificationService.dismissLoading();
    }
  }
}
