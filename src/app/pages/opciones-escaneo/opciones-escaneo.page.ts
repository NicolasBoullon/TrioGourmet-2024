import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { RouterLink } from '@angular/router';
import { DatabaseService } from 'src/app/core/services/database.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from '@angular/fire/auth';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { Usuario } from 'src/app/core/models/usuario.models';
import { firstValueFrom } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-opciones-escaneo',
  templateUrl: './opciones-escaneo.page.html',
  styleUrls: ['./opciones-escaneo.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, HeaderComponent, RouterLink, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class OpcionesEscaneoPage implements OnInit {

  private _authService = inject(AuthService);
  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);
  private _apiRequestService = inject(ApiRequestService); 
  private _route = inject(ActivatedRoute);

  protected user?: User | null;
  protected userDoc?: Usuario;

  protected estado?: string | null;

  async ngOnInit() {
    this.estado = this._route.snapshot.queryParamMap.get('estado');
    
    const user = await this._authService.getCurrentUserOnce();

    if (user && user.email) {
      this.user = user;
      this.userDoc = await firstValueFrom(this._databaseService.getDocumentById('usuarios', user.email));
    }
  }

  async pedirLaCuenta() {
    this._notificationService.presentLoading('Solicitando la cuenta...');
    try {
      await this._databaseService.updateDocumentField('usuarios', this.user!.email!, 'estado', 'cuenta solicitada');
      this._apiRequestService.notifyRole('Un cliente solicito la cuenta', `La ${this.userDoc?.mesa} está esperando la cuenta.`, 'mozo').subscribe();
      this._notificationService.presentToast('Solicitud de cuenta enviada al mozo', 1000, 'success', 'middle');
      this._notificationService.routerLink('/home');
    }
    catch {
      this._notificationService.presentToast('Ocurrió un error con la solicitud. Intente nuevamente.', 1000, 'danger', 'middle');
    }
    finally {
      this._notificationService.dismissLoading();
    }
  }

}
