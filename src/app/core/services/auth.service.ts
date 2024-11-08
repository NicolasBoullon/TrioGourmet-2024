import { inject, Injectable } from '@angular/core';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { PersonaCredenciales } from '../models/personaCredenciales.models';
import { person } from 'ionicons/icons';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);

  signUp(personaCredenciales: PersonaCredenciales): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, personaCredenciales.email, personaCredenciales.password)
    .then(response => {
      return updateProfile(response.user, { displayName: personaCredenciales.name })
      .then(() => response);
    });
  }


  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  sendRecoveryEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }
}
