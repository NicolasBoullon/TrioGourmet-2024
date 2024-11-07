import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../../shared/header/header.component";

@Component({
  selector: 'app-juego-10',
  templateUrl: './juego-10.page.html',
  styleUrls: ['./juego-10.page.scss'],
  standalone: true,
  imports: [IonButton,
     IonCol, 
     IonRow, 
     IonGrid, 
     IonContent, 
     IonHeader, 
     IonTitle, 
     IonToolbar, 
     CommonModule, 
     FormsModule,
     CommonModule, 
     HeaderComponent
    ]
})
export class Juego10Page implements OnInit {

  constructor() { }
  temp:number = 0;
  empezando:boolean = false;
  reiniciar:boolean = false;
  gano:boolean = false;
  perdio:boolean = false;
  intervalo:any;
  ngOnInit() {
    
  }


  EmpezarCronometro() {
    if (!this.empezando) {
      this.empezando = true;
      this.intervalo = setInterval(() => {
        this.temp += 0.1; 
        this.temp = parseFloat(this.temp.toFixed(1)); 
      }, 100);
    } else {
      this.DetenerCronometro();
    }
  }

  DetenerCronometro() {
    this.empezando = false;
    this.reiniciar = true;
    this.temp == 10? this.gano = true : this.perdio = true;
    clearInterval(this.intervalo);
  }
  ReinicarCronometro(){
    clearInterval(this.intervalo);
    this.temp = 0;
    this.reiniciar = false;
    this.empezando = false;
    this.gano = false;
    this.perdio = false;
    this.EmpezarCronometro();
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }
}
