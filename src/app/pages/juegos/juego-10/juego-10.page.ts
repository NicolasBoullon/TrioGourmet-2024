import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/core/models/usuario.models';
import { DatabaseService } from 'src/app/core/services/database.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-juego-10',
  templateUrl: './juego-10.page.html',
  styleUrls: ['./juego-10.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    CommonModule,
    FormsModule,
    CommonModule,
    HeaderComponent,
  ],
})
export class Juego10Page implements OnInit {
  constructor() {}
  temp: number = 0;
  cronometroEmpezado: boolean = false;
  gano: boolean = false;
  intervalo: any;
  porcentajeDescuento: number = 0;

  private _authService = inject(AuthService);
  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);

  protected user: User | null = null;
  protected userDoc?: Usuario;
  protected juegoTerminado: boolean = false;

  async ngOnInit() {
    const user = await this._authService.getCurrentUserOnce();

    if (user && user.email) {
      this.user = user;
      this.userDoc = await firstValueFrom(
        this._databaseService.getDocumentById('usuarios', user.email)
      );
    }
  }

  EmpezarCronometro() {
    this.cronometroEmpezado = true;
    this.intervalo = setInterval(() => {
      this.temp += 0.1;
      this.temp = parseFloat(this.temp.toFixed(1));
    }, 100);
  }

  DetenerCronometro() {
    this.juegoTerminado = true;
    this.cronometroEmpezado = false;
    clearInterval(this.intervalo);
    if (this.temp == 10)
    {
      this.gano = true;
      this.porcentajeDescuento = 10;
    }
    this.actualizarDescuentoPedido();
  }

  async actualizarDescuentoPedido() {
    if (this.porcentajeDescuento == 10)
      await this._notificationService.presentLoading('Aplicando descuento...');
    else
      await this._notificationService.presentLoading('Perdiste, redirigiendo a inicio...');
    
    await this._databaseService.updateDocumentField(
      'pedidos',
      this.userDoc?.idPedidoActual!,
      'porcentajeDescuento',
      this.porcentajeDescuento
    );
    
    this._notificationService.dismissLoading();

    if (this.porcentajeDescuento == 0)
    {
      this._notificationService.routerLink('/home');
    }
    else
    {
      await this._notificationService.showConfirmAlert(
        'Descuento aplicado',
        '¡Su descuento de 10% al pago total fue aplicado correctamente!',
        'Aceptar',
        () => this._notificationService.routerLink('/home')
      );
    }
  }

  ionViewWillLeave() {
    clearInterval(this.intervalo);
    this.temp = 0;
    this.cronometroEmpezado = false;
    this.gano = false;
    this.porcentajeDescuento = 0;
    this.juegoTerminado = false;
  }
}
