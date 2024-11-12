import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { User } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../models/usuario.models';

export const loginGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _databaseService = inject(DatabaseService);

  const router = inject(Router);
  
  if (_authService.skipGuardCheck) {
    console.log("skipGuard")
    return true;
  }

  return new Promise((resolve) => {
    _authService.auth.onAuthStateChanged(async (auth: User | null) => {
      if (_authService.skipGuardCheck) {
        console.log("skipGuard2")
        resolve(true);
        return;
      }
      
      if (auth)
      {
        const clienteDoc: Usuario = await firstValueFrom(
          _databaseService.getDocumentById('usuarios', auth.email!)
        );
        if (
          clienteDoc.perfil == 'cliente' &&
          clienteDoc.estadoAprobacionCuenta != 'aprobada'
        )
        {
          resolve(true);
        }
        else
        {
          console.log("mueve al home 1 ");
          router.navigateByUrl('/home', { replaceUrl: true });
          resolve(false);
        }
      } 
      else
      {
        resolve(true);  
      }
    })
  })
};
