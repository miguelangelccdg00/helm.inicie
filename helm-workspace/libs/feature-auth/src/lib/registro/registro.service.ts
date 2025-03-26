import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

export interface RegistroResponse {
  message: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = 'http://localhost:3009/registro/registrarUsuario';

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: string, contrasena: string, email?: string): Observable<RegistroResponse> {
    const body: Partial<Usuario> = { 
      nombreUsuario: usuario, 
      contraseña: contrasena
    };
    
    if (email) {
      body.email = email;
    }
    
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<RegistroResponse>(this.apiUrl, body, { headers });
  }
}