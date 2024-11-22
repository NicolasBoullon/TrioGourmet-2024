import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'
import { PagarMontoComponent } from 'src/app/components/pagar-monto/pagar-monto.component';
import { HeaderComponent } from "../../shared/header/header.component";
import { Auth, User } from '@angular/fire/auth';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Pedido } from 'src/app/core/models/pedido.model';
import { Usuario } from 'src/app/core/models/usuario.models';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PagarMontoComponent, HeaderComponent]
})
export class CuentaPage implements OnInit {

  PropinaElegida!:boolean;

  isModalOpenPagar:boolean = false;

  MontoTotalConPropinaYDescuento:any = 0;
  
  private _authService = inject(AuthService)
  private _databaseService = inject(DatabaseService);
  private _notificationService = inject(NotificationService);

  usuarioActual!:User | null;
  correoDelUsuarioActual:any;
  pedidos:Pedido[] = [];
  cliente!:Usuario;
  // idPedido!:string;
  pedido!:Pedido;

  mostrar!:Promise<boolean>
  ngOnInit() {
    this.GetUser();
  }

  MostrarPropina()
  {
    const importeTotal = parseFloat(this.CalcularImporteTotal());
    const propina = (importeTotal * this.pedido.porcentajePropina ) / 100;
    return propina.toFixed(2);
  }

  MostrarDescuento(): string
  {
    let descuento: string = '0';

    const importeTotal = parseFloat(this.CalcularImporteTotal());

    if (this.pedido.porcentajeDescuento == 10)
    {
      descuento = ((importeTotal * this.pedido.porcentajeDescuento) / 100).toFixed(2);
    }
    
    return descuento;
  }

  async GetUser(){
    this.usuarioActual = await this._authService.getCurrentUserOnce();
    this.correoDelUsuarioActual = this.usuarioActual?.email;
    await this.GetUsuarios();
  }

  async GetPedido(idPedido:string){
    this._databaseService.getDocumentById('pedidos',idPedido).subscribe({
      next:((value)=>{
        console.log(value);
        this.pedido = value;
        this.PropinaElegida = this.pedido.porcentajePropina > 0 ? true : false;
        this.mostrar = Promise.resolve(true);
      })
    })
  }
  async GetUsuarios(){
    this._databaseService.getDocumentById('usuarios',this.correoDelUsuarioActual).subscribe({
      next:((value)=>{
        this.cliente = value;
        // this.idPedido = value.idPedidoActual;
        this.GetPedido(value.idPedidoActual);
      })
    })
  }


  MontoTotalConPropinaYDescuentoCalcular() {
    let total = parseFloat(this.CalcularImporteTotal());
    let prop = 0;
    let desc = 0;

    if (this.pedido.porcentajePropina)
    {
      prop = parseFloat(this.MostrarPropina());
    }

    if (this.pedido.porcentajeDescuento)
    {
      desc = parseFloat(this.MostrarDescuento());
    }

    total = total + prop - desc;

    this.MontoTotalConPropinaYDescuento = total;

    return total.toFixed(2);
  }


  CalcularTotal(cantidad:number,precioUnitario:number){
    // const precioInt = parseFloat(precioUnitario);
    const total = cantidad * precioUnitario;
    return total.toFixed(2);
  }

  CalcularImporteTotal(){
    let acumulador = 0; 
    this.pedido.productos.forEach((producto) => {
      acumulador += parseFloat(this.CalcularTotal(producto.cantidad, producto.precio));
    });
    return acumulador.toFixed(2); 
  }

  async RecibirPago(pago:boolean){
    if(pago){
      console.log('Pago de forma correcta');
      try {
        this.CloseModalPagar();
        await this._databaseService.updateDocumentField('pedidos',this.pedido.id,'importeTotalConPropinaYDescuento',this.MontoTotalConPropinaYDescuento)
        await this._databaseService.updateDocumentField('usuarios', this.pedido.cliente, 'estado', 'cuenta pagada');
        await this._databaseService.updateDocumentField('pedidos', this.pedido.id, 'estado', 'finalizado');
        this._notificationService.presentToast('Pago realizado con exito.', 2000, 'success', 'bottom');
        this._notificationService.routerLink('/home');
      }
      catch {
        this.CloseModalPagar();
        this._notificationService.presentToast('Error al realizar el pago, intente nuevamente.', 2000, 'danger', 'bottom');
      }
    }
  }

  formateDate(timestamp:any,tipo:'fecha' | 'hora'){
    const fecha = new Date(timestamp.seconds * 1000);
    if(tipo == 'fecha'){
      return formatDate(fecha, 'dd/MM/yyyy', 'en-US');
    }
    if(tipo == 'hora'){
      return formatDate(fecha, 'HH:mm', 'en-US');
    }
    return null;
  }

  CloseModalPagar(){
    this.isModalOpenPagar = false;
    console.log('cerro');
  }

  AbrirModalPagar(){
    this.isModalOpenPagar = true;
  }

}
