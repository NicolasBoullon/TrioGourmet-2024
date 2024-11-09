import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {
  private httpClient = inject(HttpClient);
  private apiTrioGourmet = 'https://api-pps-trio-gourmet.onrender.com/'

  constructor() { }

  public notifyRole(title: string, body: string, role: string) {
    const peticion = this.httpClient.post(
      this.apiTrioGourmet + 'notify-role',
      { title, body, role },
      { responseType: 'text' } 
    );
  
    return peticion;
  }

  public sendMail(aceptacion: boolean, nombreUsuario: string, mail: string)
  {
    const peticion = this.httpClient.post(
      this.apiTrioGourmet + 'send-mail',
      {aceptacion, nombreUsuario, mail}
    )
    
    return peticion;
  }
}
