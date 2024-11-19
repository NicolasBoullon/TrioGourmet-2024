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
import { RouterLink } from '@angular/router';

register();

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, DatePipe, HeaderComponent, RouterLink]
})
export class EncuestaPage implements OnInit {

  private authSubscription?: Unsubscribe;
  private authService = inject(AuthService);
  private databaseService = inject(DatabaseService);

  protected user?: User | null;
  protected userDoc?: Usuario;
  
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

  encuestas: Encuesta[] = [
    {
      fecha: new Date(),
      calificacionGeneral: 9,
      calidadComida: 'Excelente',
      tiempoEspera: 'Muy rápido',
      amabilidadPersonal: 'Muy amable',
      limpieza: ['Mesas', 'Pisos', 'Baños'],
      fotos: ['assets/images/restaurante-1.jpg', 'assets/images/restaurante-2.jpg']
    },
    {
      fecha: new Date(),
      calificacionGeneral: 7,
      calidadComida: 'Buena',
      tiempoEspera: 'Aceptable',
      amabilidadPersonal: 'Amable',
      limpieza: ['Mesas', 'Pisos'],
      fotos: ['assets/images/restaurante-1.jpg']
    }
  ];

  verDetalles(encuesta: Encuesta) {
    console.log('Detalles de la encuesta:', encuesta);
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription();
    }
  }
}
