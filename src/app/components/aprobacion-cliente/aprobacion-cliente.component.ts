import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { DatabaseService } from 'src/app/core/services/database.service';
import { Subscription } from 'rxjs';
import { Cliente } from 'src/app/core/models/cliente.models';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-aprobacion-cliente',
  templateUrl: './aprobacion-cliente.component.html',
  styleUrls: ['./aprobacion-cliente.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AprobacionClienteComponent  implements OnInit {

  private _databaseService = inject(DatabaseService);
  private _notificactionService = inject(NotificationService);

  protected sub!:Subscription;
  protected clientes: Cliente[] = [];
  protected clientesSinAprobacion: Cliente[] = []
  protected clienteSelected!:Cliente;

  protected isModalOpen:boolean = false;
  constructor() { }

  ngOnInit() {
    this.sub = this._databaseService.getDocument('usuarios').subscribe({
      next: (res => {
        this.clientes = res.filter((usuario: any) => usuario.perfil === 'cliente');
        // this.clientes = res;
        this.clientesSinAprobacion = this.clientes.filter((cliente) => cliente.estadoAprobacionCuenta == 'pendiente');
      })
    })
  }

  async aprobarCliente(clienteSelected: Cliente){
    this._notificactionService.presentLoading('Aprobando cliente...');
    await this._databaseService.updateDocumentField('usuarios', clienteSelected.email, 'estadoAprobacionCuenta', 'aprobada');
    this._notificactionService.dismissLoading();
    this.closeModal();
  }

  async rechazarCliente(clienteSelected: Cliente){
    this._notificactionService.presentLoading('Rechazando cliente...');
    await this._databaseService.updateDocumentField('usuarios', clienteSelected.email, 'estadoAprobacionCuenta', 'rechazada');
    this._notificactionService.dismissLoading();
    this.closeModal();
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
