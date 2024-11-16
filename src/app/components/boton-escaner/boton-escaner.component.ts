import { Component, inject, Input, OnInit } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline } from 'ionicons/icons';
import { ScannerService } from 'src/app/core/services/scanner.service';

@Component({
  selector: 'app-boton-escaner',
  templateUrl: './boton-escaner.component.html',
  styleUrls: ['./boton-escaner.component.scss'],
  standalone: true,
  imports: [
    IonImg
  ]
})
export class BotonEscanerComponent  implements OnInit {

  protected scannerService = inject(ScannerService);
  @Input() correo!: string;

  constructor() {
    addIcons({ qrCodeOutline });
  }

  ngOnInit() {
  }

}
