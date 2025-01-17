import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { DatabaseService } from 'src/app/core/services/database.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoadingComponent } from '../loading/loading.component';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { Usuario } from 'src/app/core/models/usuario.models';
import { checkmarkCircle, chevronDown, chevronUp, closeCircle } from "ionicons/icons";
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-aprobacion-cliente',
  templateUrl: './aprobacion-cliente.component.html',
  styleUrls: ['./aprobacion-cliente.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LoadingComponent]
})
export class AprobacionClienteComponent  implements OnInit {

  private _databaseService = inject(DatabaseService);
  private _notificactionService = inject(NotificationService);
  private _apiRequestService = inject(ApiRequestService);

  protected sub!:Subscription;
  protected clientes: Usuario[] = [];
  protected clientesSinAprobacion: Usuario[] = []
  protected clienteSelected!:Usuario;
  protected expandedRow: number | null = null;

  protected isModalOpen: boolean = false;
  protected isLoading: boolean = false;

  constructor() { addIcons({ closeCircle, checkmarkCircle, chevronUp, chevronDown });}

  ngOnInit() {
    this.isLoading = true;
    
    this.sub = this._databaseService.getDocument('usuarios').subscribe({
      next: (res => {
        this.clientes = res.filter((usuario: any) => usuario.perfil === 'cliente');
        this.clientesSinAprobacion = this.clientes.filter((cliente) => cliente.estadoAprobacionCuenta == 'pendiente');
        this.isLoading = false;
      })
    })
  }

  toggleExpand(index: number) {
    this.expandedRow = this.expandedRow == index ? null : index;
  }

  async aprobarCliente(clienteSelected: Usuario){
    this._notificactionService.presentLoading('Aprobando cliente...');
    await this._databaseService.updateDocumentField('usuarios', clienteSelected.email, 'estadoAprobacionCuenta', 'aprobada');
    this._notificactionService.dismissLoading();
    this.closeModal();
    this._apiRequestService.sendMail(true, `${clienteSelected.name} ${clienteSelected.apellido}`, clienteSelected.email).subscribe();
  }

  async rechazarCliente(clienteSelected: Usuario){
    this._notificactionService.presentLoading('Rechazando cliente...');
    await this._databaseService.updateDocumentField('usuarios', clienteSelected.email, 'estadoAprobacionCuenta', 'rechazada');
    this._notificactionService.dismissLoading();
    this.closeModal();
    this._apiRequestService.sendMail(false, `${clienteSelected.name} ${clienteSelected.apellido}`, clienteSelected.email).subscribe();
  }

  openModal(cliente: Usuario) {
    this.isModalOpen = true;
    this.clienteSelected = cliente;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
