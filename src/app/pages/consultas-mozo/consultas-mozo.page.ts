import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonButton, IonLabel, IonModal, IonButtons, IonFooter, IonTextarea} from '@ionic/angular/standalone';
import { HeaderComponent } from "../../shared/header/header.component";
import { Consulta } from 'src/app/core/models/consulta.model';
import { DatabaseService } from 'src/app/core/services/database.service';
import { LoadingComponent } from "../../components/loading/loading.component";
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-consultas-mozo',
  templateUrl: './consultas-mozo.page.html',
  styleUrls: ['./consultas-mozo.page.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonButton, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonFooter, IonButtons, FormsModule, HeaderComponent, LoadingComponent, DatePipe, IonTextarea]
})
export class ConsultasMozoPage implements OnInit {

  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);

  constructor() { }

  consultas: Consulta[] | null = null;

  isModalOpen = false;
  respuesta: string = '';
  consultaSeleccionada?: Consulta;

  ngOnInit() {
    this.obtenerConsultas();
  }

  async obtenerConsultas() {
    this._databaseService.getDocument('consultas').subscribe((consultas: any[]) => {
      this.consultas = consultas.map((consulta) => {
        return {
          ...consulta,
          fecha: this._databaseService.convertTimestampToDate(consulta.fecha)
        };
      });
    });
  }

  openRespuestaModal(consulta: Consulta) {
    this.isModalOpen = true;
    this.consultaSeleccionada = consulta
  }

  closeRespuestaModal() {
    this.isModalOpen = false;
    this.respuesta = ''; 
  }

  async sendRespuesta() {
    console.log(this.respuesta);
    if (this.respuesta.length > 10 && this.respuesta.length < 200)
    {

      const consulta: Consulta = {
        id: this.consultaSeleccionada!.id,
        mesa: this.consultaSeleccionada!.mesa,
        consulta: this.consultaSeleccionada!.consulta,
        respuesta: this.respuesta,
        fecha: new Date(),
        mailCliente: this.consultaSeleccionada!.mailCliente,
        respondida: true
      }

      await this._notificationService.presentLoading('Enviando respuesta de la consulta...');
      try {
        await this._databaseService.updateDocument('consultas', this.consultaSeleccionada!.id!, consulta);
        await this._databaseService.updateDocumentField('usuarios', this.consultaSeleccionada!.mailCliente!, 'consulta', consulta);
      }
      catch (error: any) {
        console.log(error)
      }
      finally {
        this._notificationService.dismissLoading();
        this.closeRespuestaModal();
      }
    }
    else
    {
      this._notificationService.presentToast('Su consulta debe ser de entre 10 y 200 caracteres', 2000, 'warning', 'bottom');
    }
  }
}
