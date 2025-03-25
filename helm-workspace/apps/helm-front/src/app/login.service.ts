import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private apiUrl = 'http://localhost:3009/login/loginUsuario'; // URL del endpoint backend

  constructor(private http: HttpClient) { }

  login(usuario: string, contrasena: string): Observable<LoginResponse> {
    const body = { nombreUsuario: usuario, contraseña: contrasena };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<LoginResponse>(this.apiUrl, body, { headers });
  }
  
}