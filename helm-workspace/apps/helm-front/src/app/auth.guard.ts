import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  console.log('authGuard: se ejecutó el guard para la ruta:', state.url);

  return loginService.validateToken().pipe(
    map(valid => {
      console.log('authGuard: resultado de validateToken:', valid);
      if (valid) {
        console.log('authGuard: acceso permitido');
        return true;
      } else {
        console.warn('authGuard: token inválido, redirigiendo al login');
        localStorage.removeItem('token');
        router.navigate(['/']);
        return false;
      }
    }),
    catchError(err => {
      console.error('authGuard: error al validar el token', err);
      localStorage.removeItem('token');
      router.navigate(['/']);
      return of(false);
    })
  );
  
};
