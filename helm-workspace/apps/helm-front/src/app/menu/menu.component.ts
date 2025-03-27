import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass',
})
export class MenuComponent {
  constructor(private router: Router) {}
  
  // Propiedad para controlar el elemento seleccionado
  itemSeleccionado: number = -1;
  
  // Propiedades para controlar los menús desplegables
  menuActivo: string | null = null;
  posicionMenu: number = 0;
  
  // Método para seleccionar un elemento del menú
  seleccionarItem(index: number, event: Event): void {
    event.preventDefault();
    this.itemSeleccionado = index;
  }
  
  // Método para verificar si un elemento está seleccionado
  estaSeleccionado(index: number): boolean {
    return this.itemSeleccionado === index;
  }
  
  // Método para mostrar/ocultar menús desplegables
  toggleMenu(menu: string, event?: MouseEvent): void {
    if (event) {
      const element = event.currentTarget as HTMLElement;
      const rect = element.getBoundingClientRect();
      this.posicionMenu = rect.top;
      event.preventDefault();
      event.stopPropagation();
    }
    
    this.menuActivo = this.menuActivo === menu ? null : menu;
  }
  
  // Cerrar menús al hacer clic fuera de ellos
  @HostListener('document:click')
  closeMenus(): void {
    this.menuActivo = null;
  }
  
  // Método para llevar a store soluciones
  irAStoreSoluciones(): void {
    this.closeMenus();
    this.router.navigate(['store-soluciones']);
  }
  
  // Método para navegar a otras rutas
  navegarA(ruta: string, event: Event): void {
    event.preventDefault();
    this.closeMenus();
    this.router.navigate([ruta]);
  }

  
}