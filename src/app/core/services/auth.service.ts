import { inject, Injectable } from '@angular/core';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from '@angular/fire/auth';
import { PersonaCredenciales } from '../models/personaCredenciales.models';
import { person } from 'ionicons/icons';
import { NotificationsPushService } from './notifications-push.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);
  notificationPushService = inject(NotificationsPushService);
  public skipGuardCheck = false;

  async getCurrentUserOnce(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged(
        (user) => {
          unsubscribe();
          resolve(user);
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    });
  }

  
  async signUp(personaCredenciales: PersonaCredenciales): Promise<void> {
    try
    {
      this.skipGuardCheck = true;

      const userCredentials: UserCredential = await createUserWithEmailAndPassword(this.auth, personaCredenciales.email, personaCredenciales.password)

      await updateProfile(userCredentials.user, { displayName: personaCredenciales.perfil });

      if (personaCredenciales.perfil != 'anonimo')
      {
        await this.signOut();
      }
    }
    catch (error){
      console.log(error);
    }
    finally {
      this.skipGuardCheck = false;
    }
    
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
