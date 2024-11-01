import { inject, Injectable } from '@angular/core';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);

  signUp(email: string, password: string, name: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then(response => {
      return updateProfile(response.user, { displayName: name })
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
