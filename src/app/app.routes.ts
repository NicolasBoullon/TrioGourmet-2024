import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/cliente-sign-up/cliente-sign-up.page').then( m => m.ClienteSignUpPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'juego-10',
    loadComponent: () => import('./pages/juegos/juego-10/juego-10.page').then( m => m.Juego10Page)
  },  {
    path: 'anonimo-sign-up',
    loadComponent: () => import('./pages/auth/anonimo-sign-up/anonimo-sign-up.page').then( m => m.AnonimoSignUpPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/propietario/inicio/inicio.page').then( m => m.InicioPage)
  },


];
