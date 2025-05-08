import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

// Interfaz que define la estructura de la respuesta del backend al hacer login
export interface LoginResponse {
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  token?: string;
}

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible globalmente en la aplicación
})
export class LoginService {
  // URL del backend donde se hace la autenticación
  private apiUrl = 'http://localhost:3009/login/loginUsuario';
  
  // Comportamiento del estado de autenticación del usuario
  private loggedIn = new BehaviorSubject<boolean>(this.isAuth()); // Valor inicial según si el usuario está autenticado

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión con el nombre de usuario y la contraseña
  login(usuario: string, contrasena: string): Observable<LoginResponse> {
    const body = { nombreUsuario: usuario, contraseña: contrasena }; // Cuerpo de la solicitud con las credenciales
    const headers = new HttpHeaders().set('Content-Type', 'application/json'); // Cabecera de la solicitud

    // Se hace la petición POST al backend para autenticar al usuario
    return this.http.post<LoginResponse>(this.apiUrl, body, { headers }).pipe(
      tap(response => {
        // Si la respuesta contiene un usuario y un token, se guarda en localStorage
        if (response.user && response.token) {
          localStorage.setItem('user', JSON.stringify(response.user)); // Guarda el usuario en localStorage
          localStorage.setItem('token', response.token); // Guarda el token en localStorage
          this.loggedIn.next(true); // Actualiza el estado de autenticación a 'true'
        }
      })
    );
  }

  // Método para obtener el token de autenticación desde el localStorage
  getToken(): string | null {
    return localStorage.getItem('token'); // Retorna el token guardado en localStorage
  }

  // Método para verificar si el usuario está autenticado
  isAuth(): boolean {
    // Verifica si tanto el usuario como el token existen en el localStorage
    return localStorage.getItem('user') !== null && localStorage.getItem('token') !== null;
  }

  // Método para obtener un Observable que indica si el usuario está autenticado o no
  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable(); // Retorna un Observable con el estado de autenticación
  }

  // Método para cerrar sesión y eliminar el usuario y el token de localStorage
  logout() {
    localStorage.removeItem('user'); // Elimina el usuario del localStorage
    localStorage.removeItem('token'); // Elimina el token del localStorage
    this.loggedIn.next(false); // Actualiza el estado de autenticación a 'false'
  }

  // Método para validar el token de autenticación
  validateToken(): Observable<boolean> {
    const token = this.getToken();
  
    if (!token) {
      this.logout(); // Elimina datos si no hay token
      return new BehaviorSubject(false).asObservable();
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<{ message: string, usuario: any }>('http://localhost:3009/token/perfil', { headers })
      .pipe(
        tap({
          error: () => {
            this.logout(); // Token inválido o expirado
          }
        }),
        // Si llega aquí es que el token es válido
        // Mapeamos a true
        map(() => true)
      );
  }
}