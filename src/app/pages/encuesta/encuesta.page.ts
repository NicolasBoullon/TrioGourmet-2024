import { DatePipe } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { Encuesta } from 'src/app/core/models/encuesta.model';
import { HeaderComponent } from "../../shared/header/header.component";
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, DatePipe, HeaderComponent]
})
export class EncuestaPage implements OnInit {

  constructor() { }

  ngOnInit() {}

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

}
