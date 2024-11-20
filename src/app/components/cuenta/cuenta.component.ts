import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular'
import { SeleccionarPropinaComponent } from "../seleccionar-propina/seleccionar-propina.component";
import { PagarMontoComponent } from '../pagar-monto/pagar-monto.component';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss'],
  standalone:true,
  imports: [IonicModule, FormsModule, CommonModule, SeleccionarPropinaComponent,PagarMontoComponent]
})
export class CuentaComponent  implements OnInit {

  constructor() { }

  PropinaElegida!:number;
  isModalOpenPropina:boolean = false;
  isModalOpenPagar:boolean = false;
  MontoTotalConPropina:any = 0;
  SeleccionoPropina(valor:number){
    if(valor != 0){
      this.PropinaElegida = valor;
      this.CloseModal();
      // this.MostrarPropina(); 
    }else{
      this.PropinaElegida = 0;
      this.CloseModal();
      // this.MontoTotalConPropina = this.CalcularImporteTotal();
    }
  }

  MostrarPropina()
  {
    const importeTotal = parseFloat(this.CalcularImporteTotal());
    const propina = importeTotal * this.PropinaElegida;
    return propina.toFixed(2);
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


  CalcularTotal(cantidad:number,precioUnitario:string){
    const precioInt = parseFloat(precioUnitario);
    const total = cantidad * precioInt;
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

  ngOnInit() {}
  pedido = {
      bar: 'entregado',
      cliente: "mate@anonimo.com",
      cocina:'entregado',
      estado: 'en mesa',
      fecha: '19 de noviembre de 2024',
      hora: '11:48:41 p.m',
      id: '5AgOpCM15ai9XltQzxhk',
      importeTotal: '66.94',
      mesa: 'Mesa 1',
      productos:[{
        cantidad: 3,
        descripcion: "Hamburguesa con queso y papas fritas.",
        nombre: "Hamburguesa",
        precio: '10.99',
        sector: 'Comidas',
        selected:true,
        tiempoPrepararcion: 15
      },
      {
        cantidad: 2,
        descripcion: "Pizza de pepperoni con extra queso.",
        nombre: "Pizza",
        precio: '12.99',
        sector: 'Comidas',
        selected:true,
        tiempoPrepararcion: 20
      },
      {
        cantidad: 1,
        descripcion: "Limonada fresca con menta.",
        nombre: "Limonada",
        precio: '2.99',
        sector: 'Bebidas',
        selected:true,
        tiempoPrepararcion: 5
      },
      {
        cantidad: 2,
        descripcion: "Botella de agua mineral.",
        nombre: "Agua",
        precio: '1',
        sector: 'Bebidas',
        selected:true,
        tiempoPrepararcion: 1
      }]
  }


  CloseModal(){
    this.isModalOpenPropina = false;
  }

  AbrirModalPropina(){
    this.isModalOpenPropina = true;
  }

  CloseModalPagar(){
    this.isModalOpenPagar = false;
    console.log('cerro');
    
  }

  AbrirModalPagar(){
    this.isModalOpenPagar = true;
  }
}
