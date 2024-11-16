import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-consultas-mozo',
  templateUrl: './consultas-mozo.page.html',
  styleUrls: ['./consultas-mozo.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent]
})
export class ConsultasMozoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
