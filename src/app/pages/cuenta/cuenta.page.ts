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

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PagarMontoComponent, HeaderComponent]
})
export class CuentaPage implements OnInit {

  PropinaElegida!:number;

  isModalOpenPagar:boolean = false;

  MontoTotalConPropina:any = 0;
  
  private authService = inject(AuthService)
  private databaseService = inject(DatabaseService);
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
    const propina = importeTotal * this.PropinaElegida;
    return propina.toFixed(2);
  }

  async GetUser(){
    this.usuarioActual = await this.authService.getCurrentUserOnce();
    this.correoDelUsuarioActual = this.usuarioActual?.email;
    await this.GetUsuarios();
  }

  async GetPedido(idPedido:string){
    this.databaseService.getDocumentById('pedidos',idPedido).subscribe({
      next:((value)=>{
        console.log(value);
        this.pedido = value;
        this.mostrar = Promise.resolve(true);
      })
    })
  }
  async GetUsuarios(){
    this.databaseService.getDocumentById('usuarios',this.correoDelUsuarioActual).subscribe({
      next:((value)=>{
        this.cliente = value;
        // this.idPedido = value.idPedidoActual;
        this.GetPedido(value.idPedidoActual);
      })
    })
  }


  MontoTotalConPropinaCalcular(){
    if(this.PropinaElegida){
      let total = this.CalcularImporteTotal();
      let prop = this.MostrarPropina();
      let totalConPropina = parseFloat(total) + parseFloat(prop);
      this.MontoTotalConPropina = totalConPropina;
      return totalConPropina.toFixed(2);
    }
    this.MontoTotalConPropina = this.CalcularImporteTotal();
    return this.MontoTotalConPropina;
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

  RecibirPago(pago:boolean){
    if(pago){
      console.log('Pago de forma correcta');
      this.CloseModalPagar();
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

  // pedido = {
  //     bar: 'entregado',
  //     cliente: "mate@anonimo.com",
  //     cocina:'entregado',
  //     estado: 'en mesa',
  //     fecha: '19 de noviembre de 2024',
  //     hora: '11:48:41 p.m',
  //     id: '5AgOpCM15ai9XltQzxhk',
  //     importeTotal: '66.94',
  //     mesa: 'Mesa 1',
  //     productos:[{
  //       cantidad: 3,
  //       descripcion: "Hamburguesa con queso y papas fritas.",
  //       nombre: "Hamburguesa",
  //       precio: '10.99',
  //       sector: 'Comidas',
  //       selected:true,
  //       tiempoPrepararcion: 15
  //     },
  //     {
  //       cantidad: 2,
  //       descripcion: "Pizza de pepperoni con extra queso.",
  //       nombre: "Pizza",
  //       precio: '12.99',
  //       sector: 'Comidas',
  //       selected:true,
  //       tiempoPrepararcion: 20
  //     },
  //     {
  //       cantidad: 1,
  //       descripcion: "Limonada fresca con menta.",
  //       nombre: "Limonada",
  //       precio: '2.99',
  //       sector: 'Bebidas',
  //       selected:true,
  //       tiempoPrepararcion: 5
  //     },
  //     {
  //       cantidad: 2,
  //       descripcion: "Botella de agua mineral.",
  //       nombre: "Agua",
  //       precio: '1',
  //       sector: 'Bebidas',
  //       selected:true,
  //       tiempoPrepararcion: 1
  //     }]
  // }


  CloseModalPagar(){
    this.isModalOpenPagar = false;
    console.log('cerro');
    
  }

  AbrirModalPagar(){
    this.isModalOpenPagar = true;
  }

}
