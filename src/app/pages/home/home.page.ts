import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { AuthService } from '../../core/services/auth.service';
import { Unsubscribe, User } from '@angular/fire/auth';
import { AprobacionClienteComponent } from "../../components/aprobacion-cliente/aprobacion-cliente.component";
import { NotificationsPushService } from '../../core/services/notifications-push.service';
import { LoadingComponent } from "../../components/loading/loading.component";
import { SolicitarMesaComponent } from 'src/app/components/solicitar-mesa/solicitar-mesa.component';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Usuario } from 'src/app/core/models/usuario.models';
import { AsignacionMesaComponent } from "../../components/asignacion-mesa/asignacion-mesa.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    AprobacionClienteComponent,
    LoadingComponent,
    SolicitarMesaComponent,
    AsignacionMesaComponent
],
})
export class HomePage {
  private _authService = inject(AuthService);
  private _notificationsPushService = inject(NotificationsPushService);
  private _databaseService = inject(DatabaseService);

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
}
