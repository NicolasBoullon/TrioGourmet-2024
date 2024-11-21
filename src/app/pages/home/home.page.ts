import { Component, inject,} from '@angular/core';
import { IonContent, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonItem, IonLabel, IonTextarea, IonFooter } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { AuthService } from '../../core/services/auth.service';
import { User } from '@angular/fire/auth';
import { AprobacionClienteComponent } from "../../components/aprobacion-cliente/aprobacion-cliente.component";
import { NotificationsPushService } from '../../core/services/notifications-push.service';
import { LoadingComponent } from "../../components/loading/loading.component";
import { DatabaseService } from 'src/app/core/services/database.service';
import { Usuario } from 'src/app/core/models/usuario.models';
import { AsignacionMesaComponent } from "../../components/asignacion-mesa/asignacion-mesa.component";
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AprobacionPedidoComponent } from 'src/app/components/aprobacion-pedido/aprobacion-pedido.component';
import { SeccionBartenderComponent } from 'src/app/components/seccion-bartender/seccion-bartender.component';
import { SeccionCocineroComponent } from "../../components/seccion-cocinero/seccion-cocinero.component";
import { Subscription } from 'rxjs';
import { Consulta } from 'src/app/core/models/consulta.model';
import { BotonEscanerComponent } from "../../components/boton-escaner/boton-escaner.component";
import { GestionMesasComponent } from "../../components/gestion-mesas/gestion-mesas.component";
import { RouterLink } from '@angular/router';

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
    IonItem,
    FormsModule,
    HeaderComponent,
    AprobacionClienteComponent,
    LoadingComponent,
    BotonEscanerComponent,
    AsignacionMesaComponent,
    AprobacionPedidoComponent,
    SeccionBartenderComponent,
    SeccionCocineroComponent,
    DatePipe,
    GestionMesasComponent,
    RouterLink
],
})
export class HomePage {
  
  private _authService = inject(AuthService);
  private _notificationsPushService = inject(NotificationsPushService);
  protected _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);
  private _apiRequestService = inject(ApiRequestService);
  private _subscriptions = new Subscription();
  
  protected user?: User | null;
  protected userDoc?: Usuario;

  isModalOpen = false;
  consulta: string = '';

  async ionViewWillEnter()
  {
    try {
      const user = await this._authService.getCurrentUserOnce();
  
      if (user && user.email) {
        this.user = user;
  
        const usuariosSub = this._databaseService
          .getDocumentById('usuarios', user.email)
          .subscribe(res => {
            if (res?.consulta?.fecha) {
              res.consulta.fecha = this._databaseService.convertTimestampToDate(res.consulta.fecha);
            }
        
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

  async confirmarRecepcionPedido() {
    try {
      await this._databaseService.updateDocumentField('usuarios', this.userDoc!.email, 'recibioElPedido', true);
      this._notificationService.presentToast('Confirmación exitosa.', 2000, 'success', 'middle');
    }
    catch {
      this._notificationService.presentToast('Ocurrió un error al hacer la confirmación. Intente de nuevo.', 2000, 'danger', 'middle');
    }
  }


  openConsultaModal() {
    const consulta: Consulta | undefined = this.userDoc?.consulta;

    if (consulta)
    {
      if (consulta.respondida)
      {
        this.isModalOpen = true;
      }
      else
      {
        this._notificationService.presentToast('Su consulta todavía no ha sido respondida.', 2000, 'warning', 'bottom');
      }
    }
    else
    {
      this.isModalOpen = true;
    }
    
  }

  closeConsultaModal() {
    if (this.userDoc?.consulta != null && this.userDoc?.consulta.respondida && this.user && this.user.email)
    {
      this._databaseService.deleteDocumentField('usuarios', this.user.email, 'consulta');
    }
    this.isModalOpen = false;
    this.consulta = ''; 
  }

  async sendConsulta() {
    if (this.consulta.length > 10 && this.consulta.length < 200)
    {
      await this._notificationService.presentLoading('Enviando consulta...');
      const consulta: Consulta = {
        mesa: this.userDoc?.mesa!,
        consulta: this.consulta,
        fecha: new Date(),
        mailCliente: this.userDoc?.email,
        respondida: false
      }
      const documentId = await this._databaseService.setDocument('consultas', consulta);
      await this._databaseService.updateDocumentField('consultas', documentId, 'id', documentId);
      if (this.user && this.user.email) {
        await this._databaseService.updateDocumentField('usuarios', this.user.email, 'consulta', consulta)
      }
      this._notificationService.dismissLoading();
      await this._notificationService.showConfirmAlert(
        '¡Consulta mandada con éxito!',
        'Aguarde a que el mozo le conteste.',
        'Aceptar',
        () => {
          this._apiRequestService.notifyRole('Tiene una consulta pendiente de respuesta.', `${this.userDoc?.mesa} está esperando su respuesta`, 'mozo').subscribe();
          this.closeConsultaModal();
        }
      );
    }
    else
    {
      this._notificationService.presentToast('Su consulta debe ser de entre 10 y 200 caracteres', 2000, 'warning', 'bottom');
    }

  }
}
