import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { AuthService } from '../core/services/auth.service';
import { Unsubscribe, User } from '@angular/fire/auth';
import { AprobacionClienteComponent } from "../components/aprobacion-cliente/aprobacion-cliente.component";
import { NotificationsPushService } from '../core/services/notifications-push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    AprobacionClienteComponent
],
})
export class HomePage {
  private _authService = inject(AuthService);
  private _notificationsPushService = inject(NotificationsPushService);

  private authSubscription?: Unsubscribe;
  protected user?: User | null;

  ngOnInit() {
    this.authSubscription = this._authService.auth.onAuthStateChanged((user: User | null) => {
      this.user = user;
    })
  }

  ionViewWillEnter()
  {
    if (this.user)
    {
      this._notificationsPushService.init(this.user)
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription();
    }
  }
}
