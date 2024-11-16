import { Component, OnInit } from '@angular/core';
import { IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-opciones-escaneo',
  templateUrl: './opciones-escaneo.page.html',
  styleUrls: ['./opciones-escaneo.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, HeaderComponent, RouterLink, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class OpcionesEscaneoPage implements OnInit {

  estado?: string | null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.estado = this.route.snapshot.queryParamMap.get('estado');
    console.log(this.estado);
  }

}
