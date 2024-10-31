import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut ,sendEmailVerification} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth:Auth){}

  LogoutUser(correo:boolean)
  { 
    signOut(this.auth).then(() => {
      if(correo){ //Esto lo hago para cuando se desloguea un usuario que esta verificado
      }
    })
  }

  async LoginUser(correo: string, clave: string): Promise<any> {
    try {
      const res = await signInWithEmailAndPassword(this.auth, correo, clave);
      const user = res.user;
      
      
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
