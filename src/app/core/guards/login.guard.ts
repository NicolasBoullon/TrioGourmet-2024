import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { User } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { Cliente } from '../models/cliente.models';

export const loginGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _databaseService = inject(DatabaseService);

  const router = inject(Router);

  return new Promise((resolve) => {
    _authService.auth.onAuthStateChanged(async (auth: User | null) => {
      if (auth)
      {
        if (auth.displayName == 'cliente')
        {
          const clienteDoc: Cliente = await firstValueFrom(
            _databaseService.getDocumentById('clientes', auth.email!)
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
            router.navigateByUrl('/home', { replaceUrl: true });
            resolve(false);
          }
        }
        else
        {
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
