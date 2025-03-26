import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

export interface LoginResponse {
  message: string;
  token?: string;
  usuario?: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3009/login/loginUsuario';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si hay un token almacenado al iniciar el servicio
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
      // Aquí se podría decodificar el token para obtener información del usuario
    }
  }

  login(usuario: string, contrasena: string): Observable<LoginResponse> {
    const body = { nombreUsuario: usuario, contraseña: contrasena };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<LoginResponse>(this.apiUrl, body, { headers })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
            this.isAuthenticatedSubject.next(true);
            if (response.usuario) {
              this.currentUserSubject.next(response.usuario);
            }
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }
}