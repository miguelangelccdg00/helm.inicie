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
  seleccionarItem(indice: number, evento: Event): void {
    evento.preventDefault();
    this.itemSeleccionado = indice;
  }
  
  // Método para verificar si un elemento está seleccionado
  estaSeleccionado(indice: number): boolean {
    return this.itemSeleccionado === indice;
  }
  
  // Método para mostrar/ocultar menús desplegables
  toggleMenu(menu: string, evento?: MouseEvent): void {
    if (evento) {
      const elemento = evento.currentTarget as HTMLElement;
      const rect = elemento.getBoundingClientRect();
      this.posicionMenu = rect.top;
      evento.preventDefault();
      evento.stopPropagation();
    }
    
    this.menuActivo = this.menuActivo === menu ? null : menu;
  }
  
  // Cerrar menús al hacer clic fuera de ellos
  @HostListener('document:click')
  cerrarMenus(): void {
    this.menuActivo = null;
  }
  
  // Método para navegar a una ruta específica
  navegarA(ruta: string, evento?: Event): void {
    if (evento) {
      evento.preventDefault();
    }
    this.cerrarMenus();
    this.router.navigate([ruta]);
  }

  // Método para llevar a store soluciones
  irAStoreSoluciones(): void {
    this.cerrarMenus();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/store-soluciones']);
    });
  }
}