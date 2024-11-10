import { Component, inject, Input, OnInit } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline } from 'ionicons/icons';
import { ScannerService } from 'src/app/core/services/scanner.service';

@Component({
  selector: 'app-solicitar-mesa',
  templateUrl: './solicitar-mesa.component.html',
  styleUrls: ['./solicitar-mesa.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon
  ]
})
export class SolicitarMesaComponent  implements OnInit {

  protected scannerService = inject(ScannerService);
  @Input() correo!: string;

  constructor() {
    addIcons({ qrCodeOutline });
  }

  ngOnInit() {
  }

}
