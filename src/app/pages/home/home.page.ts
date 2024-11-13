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
    RouterLink
  ],
})
export class HomePage {

  private _authService = inject(AuthService);
  private _notificationsPushService = inject(NotificationsPushService);
  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);
  private _apiRequestService = inject(ApiRequestService);

  private authSubscription?: Unsubscribe;
  protected user?: User | null;
  protected userDoc?: Usuario;

  ngOnInit() {
    this.authSubscription = this._authService.auth.onAuthStateChanged((user: User | null) => {
      this.user = user;
      if (this.user) {
        this._databaseService.getDocumentById('usuarios', this.user.email!).subscribe(res => {
          this.userDoc = res;
        });
      }
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
