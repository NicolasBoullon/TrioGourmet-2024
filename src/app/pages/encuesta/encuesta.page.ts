import { DatePipe } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { Encuesta } from 'src/app/core/models/encuesta.model';
import { HeaderComponent } from "../../shared/header/header.component";
import { register } from 'swiper/element/bundle';
import { Unsubscribe, User } from '@angular/fire/auth';
import { Usuario } from 'src/app/core/models/usuario.models';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { NotificationService } from 'src/app/core/services/notification.service';

register();

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, DatePipe, HeaderComponent, RouterLink, LoadingComponent]
})
export class EncuestaPage implements OnInit {

  private authSubscription?: Unsubscribe;
  private authService = inject(AuthService);
  private databaseService = inject(DatabaseService);
  private _subscriptions = new Subscription();
  private _router = inject(Router);
  private _notificationService = inject(NotificationService);

  protected user?: User | null;
  protected userDoc?: Usuario;
  protected encuestas: Encuesta[] = [];

  constructor() { }

  ngOnInit() {
    this.authSubscription = this.authService.auth.onAuthStateChanged((user: User | null) => {
      this.user = user;
      
      if (this.user) {
        this.databaseService.getDocumentById('usuarios', this.user.email!).subscribe(res => {
          this.userDoc = res;
        });
      }
    })
  }

  async ionViewWillEnter() {
    try
    {
      const encuestasSubscription = this.databaseService.getDocument('encuestas').subscribe(res => {
        this.encuestas = res.map((encuesta: any) => {
          if (encuesta.fecha) {
            encuesta.fecha = this.databaseService.convertTimestampToDate(encuesta.fecha);
          }
          return encuesta;
        });
      }) 

      this._subscriptions.add(encuestasSubscription);
    }
    catch (error)
    {

    }
  }

  ionViewDidLeave() {
    this._subscriptions.unsubscribe();
    this._subscriptions = new Subscription();
    this.encuestas = [];
  }

  getLimpiezaText(limpieza: boolean[]): string {
    const opciones = ['Mesas', 'Pisos', 'Baños'];
    const seleccionados = opciones.filter((_, i) => limpieza[i]);
    return seleccionados.length > 0 ? seleccionados.join(', ') : 'Ninguno';
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription();
    }
  }

  crearEncuesta()
  {
    if (this.userDoc?.realizoEncuesta)
    {
      this._notificationService.presentToast('Usted ya creo una encuesta nueva en esta estadía. ¡No puede cargar otra!', 2000, 'warning', 'bottom');
    }
    else
    {
      this._router.navigateByUrl('/crear-encuesta');
    }
  }
}
