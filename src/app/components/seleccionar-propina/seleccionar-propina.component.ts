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
  importeCuenta:number = 100; //Este seria el importe de la cuenta
  selecciono:boolean = false;
  resultadoFinal:number = 0;
  obtenerValor() {
    const seleccionado = document.querySelector('input[name="radio-group"]:checked') as any;
    
    if (seleccionado.value != 0) {
      this.resultadoFinal = parseFloat((this.importeCuenta * parseFloat(seleccionado.value)).toFixed(2));     
      console.log(this.resultadoFinal);
      
    } else {
      console.log(this.selecciono);

      console.log('No se seleccionó ninguna opción');
    }
  }
}
