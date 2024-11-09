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
import { NotificationsPushService } from './notifications-push.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);
  notificationPushService = inject(NotificationsPushService);

  signUp(personaCredenciales: PersonaCredenciales): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, personaCredenciales.email, personaCredenciales.password)
    .then(response => {
      return updateProfile(response.user, { displayName: personaCredenciales.perfil })
      .then(() => response);
    });
  }


  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  sendRecoveryEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  async signOut(): Promise<void> {
    await this.notificationPushService.deleteToken();
    return this.auth.signOut();
  }
}
