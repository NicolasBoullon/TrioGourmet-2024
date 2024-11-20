import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular'
import { NotificationService } from 'src/app/core/services/notification.service';
@Component({
  selector: 'app-pagar-monto',
  templateUrl: './pagar-monto.component.html',
  styleUrls: ['./pagar-monto.component.scss'],
  standalone:true,
  imports:[IonicModule,FormsModule,CommonModule]
})
export class PagarMontoComponent  implements OnInit {

  constructor() { }
  private notificationService = inject(NotificationService);

  NumeroDeTarjeta:string = '';
  Propietario:string = '';
  FechaDeExpiracion:string = '';
  Cvv:string = '';
  ngOnInit() {}

  @Output() resultado = new EventEmitter<boolean>

  Pagar()
  {
    if(this.NumeroDeTarjeta.length == 16 && this.Propietario && this.FechaDeExpiracion && this.Cvv )
    {
      this.resultado.emit(true);
    }else{
      this.notificationService.presentToast('Debes llenar todos los campos',2000,'danger','bottom');
    }
  }

}
