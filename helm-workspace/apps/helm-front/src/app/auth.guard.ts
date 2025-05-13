// Este guard se encarga de proteger rutas, validando si el token es válido antes de acceder.
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  console.log('authGuard: se ejecutó el guard para la ruta:', state.url);

  // Llamamos al método que valida el token en el backend
  return loginService.validateToken().pipe(
    map(valid => {
      // Si la respuesta es válida, se permite el acceso
      console.log('authGuard: resultado de validateToken:', valid);
      if (valid) {
        console.log('authGuard: acceso permitido');
        return true;
      } else {
        // Si el token no es válido, lo borramos y redirigimos al login
        console.warn('authGuard: token inválido, redirigiendo al login');
        localStorage.removeItem('token');
        router.navigate(['/']);
        return false;
      }
    }),
    // En caso de que ocurra un error al validar (por ejemplo, el servidor no responde)
    catchError(err => {
      console.error('authGuard: error al validar el token', err);
      localStorage.removeItem('token');
      router.navigate(['/']);
      return of(false); // Retornamos false para bloquear el acceso a la ruta
    })
  );
  
};
