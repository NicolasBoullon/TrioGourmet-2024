# Trío Gourmet  

## Integrantes  
* Mateo Spatola  
* Nicolás Carlos Boullon  
* Iván Agustín Videla Ribodino  

## Materia  
* Práctica Profesional 4A  
* División A141-2  

## Profesores  
* Maximiliano Neiner  
* Alejandro Constanzo  

## Listado preliminar  

### Iván Agustín Videla Ribodino:  
* Alta dueño/supervisor.  
* Alta mesa.  
* QR de la mesa.  
* Encuesta empleados.  
* Ingresar al local.  
* Generar reservas agendadas.  
* Push notificación de:  
  - Consultar al mozo.  
  - Generar reservas agendadas/delivery.  
* Juego para obtener un 10% de descuento.  

### Nicolás Carlos Boullon:  
* Alta empleados.  
* Alta productos.  
* QR de la propina.  
* Encuesta supervisor.  
* Realizar pedidos (platos y bebidas).  
* Push notificación de:  
  - Agregar cliente nuevo.  
  - Confirmar pedido (por parte del mozo).  
* Realizar pedido con GPS o dirección.  
* Juego para obtener un 15% de descuento.  

### Mateo Spatola:  
* Alta clientes.  
* QR de ingreso al local.  
* Encuesta clientes.  
* Agregar un nuevo cliente registrado.  
* Confirmar pedidos.  
* Push notificación de:  
  - Ingreso al local.  
  - Confirmar realización del pedido (por parte del cocinero o bartender).  
* Mapa de ruta hasta el domicilio de entrega.  
* Juego para obtener un 20% de descuento.  

---
## **Tareas Realizadas**
## **Iván Agustín Videla Ribodino**  
- **Branch trabajada**: videla   
- **Splash estático**: Ícono, spinner y vibración.  
- **Creación de cliente nuevo**: Mediante escaneo de DNI.  
- **Notificaciones push**.  (Con Mateo Spatola)
- **Encuestas**:  
  - Verificar que solo pueda acceder a los resultados de las encuestas previas realizadas.  
- **Productos**:  
  - Carga de código QR para ver un listado que incluye:  
    - Imágenes.  
    - Precio.  
    - Descripción.  
    - Tiempo estimado de entrega.  
- **Mesa asignada**:  
  - Se muestra un botón de _"Consulta al mozo"_ con:  
    - Número de mesa.  
    - Fecha, hora y minutos.  
    - Consulta realizada.  
  - Verificar que la consulta llegue correctamente.  
- **Pedido**:  
  - Cliente realiza un pedido.  
  - Verificar que en todo momento se muestre:  
    - Importe total.  
    - Tiempo estimado del pedido.  

---

## **Mateo Spatola**  
- **Branch trabajada**: spatola   
- **Splash dinámico**.
- **Inicio de sesión y registro**:  
  - Registro básico.  
  - Recuperación de contraseña.  
- **Mensajes personalizados**:  
  - Logo de la empresa.  
  - Fuentes distintas.  
- **Correo electrónico automático** (Iván Agustín Videla Ribodino).  
- **Verificación de clientes**:  
  - Verificar que el cliente **NO pueda ingresar** a la aplicación si no es aceptado.  
  - Informar con un mensaje alusivo.  
- **API y deploy**:  
  - Creación de API y deploy en Render (Iván Agustín Videla Ribodino).  
- **Acceso anónimo mediante QR**:  
  - Solicitar mesa.  
  - Verificar que el cliente aparezca en la lista del maitre (con notificaciones push).  
  - Verificar que el cliente no pueda tomar una mesa sin estar en la lista de espera.  
- **Asignación de mesas**:  
  - Maitre asigna la mesa al cliente.  
  - Verificar que el cliente **NO pueda vincularse a otra mesa**, indicando que ya tiene una asignada.  
  - Escaneo del QR de la mesa asignada:  
    - Verificar que la mesa no pueda ser asignada a otro cliente.  

---

## **Nicolás Carlos Boullon**  
- **Branch trabajada**: boullon    
- **Repositorio GitHub**:  
  - Creación de repositorio completo con colaboradores.  
- **Alta de cliente anónimo**.  (Con Mateo Spatola)
- **Validación de formularios**:  
  - Formatos.  
  - Campos vacíos.  
  - Tipos de datos correctos.  
- **Pre-registro de clientes**:  
  - Verificar que el pre-registro se visualice en la lista de clientes pendientes de aprobación por el dueño o supervisor.  
  - Verificar que un cliente no pueda ingresar sin ser aprobado.  
  - Informar al cliente con un mensaje alusivo.  
- **Aprobación de clientes**:  
  - Dueño o supervisor acepta o rechaza al cliente.  
  - Verificar que, al ser aceptado, el cliente pueda ingresar.  
- **Gestión de pedidos**:  
  - Mozo confirma el pedido y lo deriva a los sectores correspondientes.  
  - Verificar que las distintas partes del pedido se visualicen en los sectores respectivos (notificaciones push).  
- **Sectores (Cocina y Bar)**:  
  - Realizan las tareas correspondientes y notifican que los productos están listos para el mozo.  
  - Cada sector ve únicamente sus propias comandas.  
- **Pedidos pendientes**:  
  - Verificar que el mozo pueda visualizar las partes del pedido pendientes en su lista.  
- **Entrega de pedidos**:  
  - El mozo entrega el pedido completo, incluyendo:  
    - Comidas.  
    - Bebidas.  
    - Postres.  

## Aplicacion

### Logo

![Logo](src/assets/icons/icon-512.webp)


### Inicio de Sesión

![Logo](src/assets/readme/loginpic.png)

### Recupero de contraseña

![Logo](src/assets/readme/olvidepassword.png)

### Registro Cliente actualizado

![Logo](src/assets/readme/registroClienteUno.png) ![Logo](src/assets/readme/registroClienteDos.png)

### Registro Cliente Anónimo

![Logo](src/assets/readme/registroClienteAnonimo.png)

### Escaneo de QR

![Logo](src/assets/readme/escanearQR.png)

### Aceptar Cliente

![Logo](src/assets/readme/aprobarCliente.png)

### Lista Clientes no aprobados

![Logo](src/assets/readme/listaClientes.png)

### Menú del Cliente con Mesa Asignada

![Logo](src/assets/readme/menuUsuarioMesaAsignada.png)

### Usuario accede a realizar pedido

![Logo](src/assets/readme/menuRealizarPedidoUno.png)

### Si el usuario quiere ver el pedido puede acceder al "Ver Pedido"

![Logo](src/assets/readme/menuRealizarPedidoDos.png)

### Una vez realizado el pedido se le dara el aviso

![Logo](src/assets/readme/pedidoHecho.png)

### Luego de esto el Mozo deberá aceptar el pedido o rechazarlo

![Logo](src/assets/readme/menuMozoAceptarPedido.png)

### De ser aceptado, cada sector recibirá una notificación con sus productos correspondientes.   

* Cocina   
![Logo](src/assets/readme/cocineroServirPlato.png)
* Barra   
![Logo](src/assets/readme/bartenderServirPedido.png)

### El Mozo accedera a ver los pedidos que ya esten listos para servir. Cada sector trabaja de forma independiente, significa que si el sector bebidas ya tiene preparado su pedido podria llevare a la mesa sin esperar al otro sector.    
* Primero bebida y luego comida      
![Logo](src/assets/readme/pedidosListosParaLlevarBebida.png)
![Logo](src/assets/readme/pedidosListosParaLlevar.png)
* En el caso de estar listo las dos cosas juntas se veria asi.   
![Logo](src/assets/readme/pedidoListoParaServirJunto.png)






