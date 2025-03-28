import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export interface SubMenuItem {
  id: number;
  titulo: string;
  categoria: string;
  ruta: string;
  orden: number;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:3009/menu';

  constructor(private http: HttpClient) { }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items`);
  }

  getSubMenuItems(): Observable<SubMenuItem[]> {
    return this.http.get<SubMenuItem[]>(`${this.apiUrl}/submenus`);
  }
}