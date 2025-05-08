import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.validateToken().pipe(
    map(valid => {
      if (valid) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
  
};
