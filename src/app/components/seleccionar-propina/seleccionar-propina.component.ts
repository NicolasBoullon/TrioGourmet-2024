import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular';
@Component({
  selector: 'app-seleccionar-propina',
  templateUrl: './seleccionar-propina.component.html',
  styleUrls: ['./seleccionar-propina.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule,FormsModule]
})
export class SeleccionarPropinaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  selecciono:boolean = false;
  obtenerValor() {
    const seleccionado = document.querySelector('input[name="radio-group"]:checked') as HTMLInputElement;
    
    if (seleccionado) {
      console.log(this.selecciono);
      
      console.log(seleccionado.value);
    } else {
      console.log(this.selecciono);

      console.log('No se seleccionó ninguna opción');
    }
  }
}
