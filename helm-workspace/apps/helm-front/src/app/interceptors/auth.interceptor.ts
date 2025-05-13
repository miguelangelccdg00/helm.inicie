// Este interceptor se encarga de agregar el token de autenticación a cada solicitud HTTP
// y redirige al login si recibe un error 403 (token inválido o expirado).
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  // Método obligatorio del interceptor. Se ejecuta en cada petición HTTP.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtenemos el token del localStorage
    const token = localStorage.getItem('token');
    // Creamos una copia de la solicitud original
    let authReq = req;
    if (token) {
      // Si existe token, clonamos la petición y le agregamos el header Authorization
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Enviamos la solicitud con (o sin) el token agregado
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el error es 403 (no autorizado), redirigimos al login
        if (error.status === 403) {
          console.warn('Interceptor detectó error 403, redirigiendo a login...');
          console.log('Token inválido o expirado:', token);
          localStorage.clear();
          this.router.navigate(['/']);
        }
        // Lanzamos el error para que otros servicios lo puedan manejar si quieren
        return throwError(() => error);
      })
    );
  }
}