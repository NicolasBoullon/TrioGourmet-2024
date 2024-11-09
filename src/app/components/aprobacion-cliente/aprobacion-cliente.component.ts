import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { DatabaseService } from 'src/app/core/services/database.service';
import { Subscription } from 'rxjs';
import { Cliente } from 'src/app/core/models/cliente.models';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoadingComponent } from '../loading/loading.component';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

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
  protected clientes: Cliente[] = [];
  protected clientesSinAprobacion: Cliente[] = []
  protected clienteSelected!:Cliente;

  protected isModalOpen: boolean = false;
  protected isLoading: boolean = false;

  constructor() { }

  ngOnInit() {
    this.isLoading = true;
    
    this.sub = this._databaseService.getDocument('usuarios').subscribe({
      next: (res => {
        this.clientes = res.filter((usuario: any) => usuario.perfil === 'cliente');
        // this.clientes = res;
        this.clientesSinAprobacion = this.clientes.filter((cliente) => cliente.estadoAprobacionCuenta == 'pendiente');
        this.isLoading = false;
      })
    })
  }

  async aprobarCliente(clienteSelected: Cliente){
    this._notificactionService.presentLoading('Aprobando cliente...');
    await this._databaseService.updateDocumentField('usuarios', clienteSelected.email, 'estadoAprobacionCuenta', 'aprobada');
    this._notificactionService.dismissLoading();
    this.closeModal();
    this._apiRequestService.sendMail(true, `${clienteSelected.name} ${clienteSelected.apellido}`, clienteSelected.email).subscribe();
  }

  async rechazarCliente(clienteSelected: Cliente){
    this._notificactionService.presentLoading('Rechazando cliente...');
    await this._databaseService.updateDocumentField('usuarios', clienteSelected.email, 'estadoAprobacionCuenta', 'rechazada');
    this._notificactionService.dismissLoading();
    this.closeModal();
    this._apiRequestService.sendMail(false, `${clienteSelected.name} ${clienteSelected.apellido}`, clienteSelected.email).subscribe();
  }

  openModal(cliente: Cliente) {
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
