import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3009/login/loginUsuario';
  private loggedIn = new BehaviorSubject<boolean>(this.isAuth());

  constructor(private http: HttpClient) { }

  login(usuario: string, contrasena: string): Observable<LoginResponse> {
    const body = { nombreUsuario: usuario, contraseña: contrasena };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<LoginResponse>(this.apiUrl, body, { headers }).pipe(
      tap(response => {
        if (response.user && response.token) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  
    // Add these new methods to handle the token
    getToken(): string | null {
      return localStorage.getItem('token');
    }
  
    isAuth(): boolean {
      return localStorage.getItem('user') !== null && localStorage.getItem('token') !== null;
    }
  
    // Método para el componente de menú que devuelve un Observable
    isAuthenticated(): Observable<boolean> {
      return this.loggedIn.asObservable();
    }
  
    logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.loggedIn.next(false);
    }
  }