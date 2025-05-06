import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz que define la estructura de los elementos del menú
export interface MenuItem {
  id: number;
  titulo: string;
  icono: string;
  posicion: string;
  orden: number;
  ruta?: string;
  categoria_submenu?: string;
  contador_notificaciones?: number;
  activo: boolean;
}

// Interfaz que define la estructura de los elementos del submenú
export interface SubMenuItem {
  id: number;
  titulo: string;
  categoria: string;
  ruta: string;
  orden: number;
  activo: boolean;
}

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible globalmente en la aplicación
})
export class MenuService {
  // URL del backend para obtener los elementos del menú
  private apiUrl = 'http://localhost:3009/menu';

  constructor(private http: HttpClient) { }

  // Método para obtener los ítems del menú
  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items`);
  }

  // Método para obtener los ítems del submenú
  getSubMenuItems(): Observable<SubMenuItem[]> {
    return this.http.get<SubMenuItem[]>(`${this.apiUrl}/submenus`);
  }
}