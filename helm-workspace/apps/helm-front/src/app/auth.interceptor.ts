import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { LoginService } from './services/login.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Inject the LoginService
  const loginService = inject(LoginService);
  
  // Obtener el token del servicio de login
  const token = loginService.getToken();
  
  // Si hay un token, clonar la solicitud y añadir el token en el header de Authorization
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  
  // Si no hay token, continuar con la solicitud original
  return next(req);
}