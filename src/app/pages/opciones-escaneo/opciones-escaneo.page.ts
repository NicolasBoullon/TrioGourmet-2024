import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { addIcons } from 'ionicons';
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
import { Pedido } from 'src/app/core/models/pedido.model';
import { LoadingComponent } from "../../components/loading/loading.component";
import { clipboardOutline, gameControllerOutline, receiptOutline, walletOutline } from 'ionicons/icons';

@Component({
  selector: 'app-opciones-escaneo',
  templateUrl: './opciones-escaneo.page.html',
  styleUrls: ['./opciones-escaneo.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    HeaderComponent,
    LoadingComponent]
})
export class OpcionesEscaneoPage implements OnInit {

  private _authService = inject(AuthService);
  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);
  private _apiRequestService = inject(ApiRequestService); 
  private _route = inject(ActivatedRoute);

  protected user?: User | null;
  protected userDoc?: Usuario;
  protected pedidoDelUsuario?: Pedido;

  protected estado?: string | null;
  protected accesoAJuegos: boolean = true;
  protected loading: boolean = false;

  constructor()
  {
    addIcons({gameControllerOutline, clipboardOutline, receiptOutline, walletOutline}); 
  }

  async ngOnInit() {
    this.estado = this._route.snapshot.queryParamMap.get('estado');
    
    this.loading = true;
    const user = await this._authService.getCurrentUserOnce();

    if (user && user.email) {
      this.user = user;
      this.userDoc = await firstValueFrom(this._databaseService.getDocumentById('usuarios', user.email));
      this.pedidoDelUsuario = await firstValueFrom(this._databaseService.getDocumentById('pedidos', this.userDoc?.idPedidoActual!));
      this.accesoAJuegos = this.pedidoDelUsuario!.porcentajeDescuento == 0 || this.pedidoDelUsuario!.porcentajeDescuento == 10 ? false : true;
      this.loading = false;
    }
  }

  async pedirLaCuenta() {
    this._notificationService.presentLoading('Solicitando la cuenta...');
    try {
      await this._databaseService.updateDocumentField('usuarios', this.user!.email!, 'estado', 'cuenta solicitada');
      this._apiRequestService.notifyRole('Un cliente solicito la cuenta', `La ${this.userDoc?.mesa} está esperando la cuenta.`, 'mozo').subscribe();
      this._notificationService.presentToast('Solicitud de cuenta enviada al mozo', 2000, 'success', 'bottom');
      this._notificationService.routerLink('/home');
    }
    catch {
      this._notificationService.presentToast('Ocurrió un error con la solicitud. Intente nuevamente.', 2000, 'danger', 'bottom');
    }
    finally {
      this._notificationService.dismissLoading();
    }
  }

  accederAJuegos()
  {
    if (this.accesoAJuegos)
      this._notificationService.routerLink('juego-10');
    else
      this._notificationService.presentToast('¡Usted ya jugó a este juego para obtener su descuento!', 2000, 'warning', 'bottom');
  }
}
