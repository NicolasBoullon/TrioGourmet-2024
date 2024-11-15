import { Component, inject,} from '@angular/core';
import { IonContent, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonItem, IonLabel, IonTextarea, IonInput, IonFooter } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { AuthService } from '../../core/services/auth.service';
import { Unsubscribe, User } from '@angular/fire/auth';
import { AprobacionClienteComponent } from "../../components/aprobacion-cliente/aprobacion-cliente.component";
import { NotificationsPushService } from '../../core/services/notifications-push.service';
import { LoadingComponent } from "../../components/loading/loading.component";
import { SolicitarMesaComponent } from 'src/app/components/solicitar-mesa/solicitar-mesa.component';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Usuario } from 'src/app/core/models/usuario.models';
import { Mensaje } from 'src/app/core/models/mensaje.model';

import { AsignacionMesaComponent } from "../../components/asignacion-mesa/asignacion-mesa.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AprobacionPedidoComponent } from 'src/app/components/aprobacion-pedido/aprobacion-pedido.component';
import { SeccionBartenderComponent } from 'src/app/components/seccion-bartender/seccion-bartender.component';
import { SeccionCocineroComponent } from "../../components/seccion-cocinero/seccion-cocinero.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonModal,
    IonTextarea,
    IonLabel,
    IonFooter,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonHeader,
    IonInput,
    IonItem,
    FormsModule,
    HeaderComponent,
    AprobacionClienteComponent,
    LoadingComponent,
    SolicitarMesaComponent,
    AsignacionMesaComponent,
    AprobacionPedidoComponent,
    SeccionBartenderComponent,
    RouterLink,
    SeccionCocineroComponent
],
})
export class HomePage {

  private _authService = inject(AuthService);
  private _notificationsPushService = inject(NotificationsPushService);
  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);
  private _apiRequestService = inject(ApiRequestService);
  private _subscriptions = new Subscription();

  protected user?: User | null;
  protected userDoc?: Usuario;
  
  async ionViewWillEnter()
  {
    try {
      const user = await this._authService.getCurrentUserOnce();
  
      if (user && user.email) {
        this.user = user;
  
        const usuariosSub = this._databaseService
          .getDocumentById('usuarios', user.email)
          .subscribe(res => {
            this.userDoc = res;
          });
  
        this._subscriptions.add(usuariosSub);
      } else {
        console.log('No hay usuario autenticado.');
      }
    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
    }

    if (this.user)
    {
      this._notificationsPushService.init(this.user)
    }
  }

  ionViewDidLeave()
  {
    this._subscriptions.unsubscribe();
    this._subscriptions = new Subscription();
    this.user = undefined;
    this.userDoc = undefined;
  }

  isModalOpen = false;
  message: string = '';

  openMessageModal() {
    this.isModalOpen = true;
  }

  closeMessageModal() {
    this.isModalOpen = false;
    this.message = ''; 
  }

  async sendMessage() {
    const mensaje: Mensaje = {
      mesa: this.userDoc?.mesa!,
      fecha: new Date(),
      mailCliente: this.userDoc?.email,
      respondido: false
    }
    await this._databaseService.setDocument('mensajes', mensaje);
    await this._notificationService.showConfirmAlert(
      '¡Mensaje mandado con éxito!',
      'Aguarde a que el mozo le conteste.',
      'Aceptar',
      () => {
        this._apiRequestService.notifyRole('Tiene un mensaje pendiente de respuesta ', `${this.userDoc?.mesa} está esperando su respuesta`, 'mozo').subscribe();
        this.closeMessageModal();
      }
    );
  }
}
