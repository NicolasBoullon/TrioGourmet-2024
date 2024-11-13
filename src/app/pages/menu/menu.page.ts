import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from "../../shared/header/header.component";
import { Categoria } from 'src/app/core/models/categoria.model';
import { Producto } from 'src/app/core/models/productoMenu.model';
import { register } from 'swiper/element/bundle';
import { DatabaseService } from 'src/app/core/services/database.service';
import { firstValueFrom } from 'rxjs';
import { LoadingComponent } from "../../components/loading/loading.component";
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationsPushService } from 'src/app/core/services/notifications-push.service';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

register();
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, LoadingComponent]
})
export class MenuPage implements OnInit {

  private databaseService = inject(DatabaseService);
  private notificationService = inject(NotificationService);
  private apiRequestService = inject(ApiRequestService);

  // LO DEJO ACÁ PARA QUE VEAN EL MENU COMO LO INCRUSTE ASI NOMAS A FIREBASE

  // menu2: Categoria[] = [
  //   {
  //     nombre: "Comidas",
  //     items: [
  //       { nombre: "Hamburguesa", imagenes: ["hamburguesa1.jpg", "hamburguesa2.jpg", "hamburguesa2.jpg"], precio: 10.99, descripcion: "Hamburguesa con queso y vegetales frescos.", tiempoPreparacion: 15, cantidad: 1 },
  //       { nombre: "Pizza", imagenes: ["pizza1.jpg"], precio: 12.99, descripcion: "Pizza de pepperoni con extra queso.", tiempoPreparacion: 20, cantidad: 1 },
  //       { nombre: "Empanadas", imagenes: ["empanada1.jpg"], precio: 1.5, descripcion: "Empanada argentina de carne.", tiempoPreparacion: 10, cantidad: 1 }
  //     ]
  //   },
  //   {
  //     nombre: "Bebidas",
  //     items: [
  //       { nombre: "Limonada", imagenes: ["limonada1.jpg"], precio: 2.99, descripcion: "Limonada fresca con menta.", tiempoPreparacion: 5, cantidad: 1 },
  //       { nombre: "Agua", imagenes: ["agua1.jpg"], precio: 1.0, descripcion: "Botella de agua mineral.", tiempoPreparacion: 1, cantidad: 1 }
  //     ]
  //   },
  //   {
  //     nombre: "Postres",
  //     items: [
  //       { nombre: "Helado", imagenes: ["helado1.jpg"], precio: 3.99, descripcion: "Helado de vainilla con chocolate.", tiempoPreparacion: 3, cantidad: 1 }
  //     ]
  //   }
  // ];

  menu: Categoria[] = []

  totalAmount = 0;
  estimatedTime = 0;

  isOrderModalOpen = false;
  orderItems: Producto[] = [];

  constructor() {}

  async ngOnInit() {
    const result = await firstValueFrom(this.databaseService.getDocumentById('menu', 'Menu'));

    // ESTO LO HICE PORQUE SI NO LO TRAE DIFERENTE, YO LO NECESITABA COMO ARRAY DE VALUES NO ARRAY NUMERICO
    if (result && typeof result === 'object') {
      this.menu = Object.values(result);  
    } else {
      console.error('Los datos no están en el formato esperado', result);
    }
    
  }

  openOrderModal() {
    if (this.orderItems.length == 0)
    {
      this.notificationService.presentToast(
        'Todavía no añadió nada al pedido.',
        2000,
        'warning',
        'bottom'
      );
    }
    else
    {
      this.isOrderModalOpen = true;
    }
  }

  closeOrderModal() {
    this.isOrderModalOpen = false;
    this.calcularAmountAndTime()
  }

  calcularAmountAndTime()
  {
    this.orderItems = this.orderItems.filter((producto: Producto) => producto.selected);

    this.totalAmount = 0;
    this.estimatedTime = 0;
    
    let productoMayorTiempoPreparacion = 0;

    this.orderItems.forEach((producto: Producto) => {
      this.totalAmount += producto.precio * producto.cantidad;
      if (productoMayorTiempoPreparacion < producto.tiempoPreparacion)
      {
        productoMayorTiempoPreparacion = producto.tiempoPreparacion
      }
      this.estimatedTime = productoMayorTiempoPreparacion
    });
  }

  checkboxClick(productoCheckbox: Producto)
  {
    // Esto lo tuve que hacer porque al momento de hacer click al checkbox agarra el estado contrario, es decir si lo apago pone true y viceversa
    this.orderItems = this.orderItems.filter((producto: Producto) => (productoCheckbox.nombre != producto.nombre && producto.selected));

    if (this.orderItems.length == 0) {
      this.closeOrderModal();
      this.notificationService.presentToast(
        'Elimino todos los productos.',
        2000,
        'warning',
        'bottom'
      );
    }
    else
    {
      this.totalAmount = 0;
      this.estimatedTime = 0;
      
      let productoMayorTiempoPreparacion = 0;

      this.orderItems.forEach((producto: Producto) => {
        this.totalAmount += producto.precio * producto.cantidad;
        if (productoMayorTiempoPreparacion < producto.tiempoPreparacion)
        {
          productoMayorTiempoPreparacion = producto.tiempoPreparacion
        }
        this.estimatedTime = productoMayorTiempoPreparacion
      });
    }
    
  }

  addToOrder(producto: Producto) {
    const existingProduct = this.orderItems.find((item: Producto) => item.nombre === producto.nombre);
    if (existingProduct) {
      existingProduct.cantidad += producto.cantidad;
    } else {
      this.orderItems.push({ ...producto });
    }
    this.calcularAmountAndTime();
    producto.cantidad = 1;
  }

  incrementarCantidad(producto: any, modal: boolean = false) {
    if (!producto.cantidad) {
      producto.cantidad = 1; 
    } else {
      producto.cantidad++;
    }
    if (modal)
      this.calcularAmountAndTime()
  }
  
  decrementarCantidad(producto: any, modal: boolean = false) {
    if (!producto.cantidad || producto.cantidad <= 1) {
      producto.cantidad = 1; 
    } else {
      producto.cantidad--;
    }
    if (modal)
      this.calcularAmountAndTime()
  }

  async realizarPedido()
  {
    await this.databaseService.setDocument('pedidos', this.orderItems, 'Acá iría la mesa que le tengo que pasar')
    await this.notificationService.showConfirmAlert(
      '¡Pedido Generado con éxito!',
      'El pedido se encuentra pendiente de confirmación. Su pedido comenzará a hacerse en cuanto el mozo confirme.',
      'Aceptar',
      () => {
        // No se como tener la mesa, se la tengo que pasar pero digamos que hice un routerLink, no se como pasarle el valor de la mesa del home, creo que se pueden pasar parametros por la url que en el celu estaría bueno porque no se ven.
        // Una vez va al home y realiza su pedido habría que también guardar en una variable que ya tiene pedido y que no pueda clickear en el menú.
        this.apiRequestService.notifyRole('Pedido en espera de confirmación', `Mesa ... está esperando la confirmación de su pedido.`, 'mozo').subscribe();
        this.notificationService.routerLink('/home');
      }
    );
  }
}
