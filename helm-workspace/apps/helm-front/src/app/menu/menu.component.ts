import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuService, MenuItem, SubMenuItem } from '../services/menu.service';
import { LoginService as AuthService } from '../services/login.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass',
})
export class MenuComponent implements OnInit {
  // Propiedades para controlar el elemento seleccionado
  itemSeleccionado: number = -1;
  
  // Propiedades para controlar los menús desplegables
  menuActivo: string | null = null;
  posicionMenu: number = 0;
  
  // Propiedades para los elementos del menú desde la base de datos
  menuItemsSuperior: MenuItem[] = [];
  menuItemsCentral: MenuItem[] = [];
  menuItemsInferior: MenuItem[] = [];
  subMenuItems: { [key: string]: SubMenuItem[] } = {};
  
  // Propiedad para controlar si el usuario está autenticado
  isLoggedIn = false;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.authService.isAuthenticated().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      
      if (isLoggedIn) {
        // Cargar menús desde la base de datos
        this.cargarMenus();
      } else {
        // Redirigir al login si no está autenticado
        this.router.navigate(['/login']);
      }
    });
  }

  cargarMenus(): void {
    this.menuService.getMenuItems().subscribe({
      next: (menuItems) => {
        // Filtrar por posición y ordenar por el campo orden
        this.menuItemsSuperior = menuItems
          .filter(item => item.posicion === 'superior' && item.activo)
          .sort((a, b) => a.orden - b.orden);
          
        this.menuItemsCentral = menuItems
          .filter(item => item.posicion === 'central' && item.activo)
          .sort((a, b) => a.orden - b.orden);
          
        this.menuItemsInferior = menuItems
          .filter(item => item.posicion === 'inferior' && item.activo)
          .sort((a, b) => a.orden - b.orden);
        
        // Cargar submenús
        this.cargarSubmenus();
      },
      error: (error) => {
        console.error('Error al cargar menús:', error);
      }
    });
  }

  cargarSubmenus(): void {
    this.menuService.getSubMenuItems().subscribe({
      next: (submenus) => {
        // Agrupar submenús por categoría
        submenus.filter(submenu => submenu.activo).forEach(submenu => {
          if (!this.subMenuItems[submenu.categoria]) {
            this.subMenuItems[submenu.categoria] = [];
          }
          this.subMenuItems[submenu.categoria].push(submenu);
        });
        
        // Ordenar cada grupo de submenús
        Object.keys(this.subMenuItems).forEach(key => {
          this.subMenuItems[key].sort((a, b) => a.orden - b.orden);
        });
      },
      error: (error) => {
        console.error('Error al cargar submenús:', error);
      }
    });
  }

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
  irAStoreSoluciones(evento?: Event): void {
    if (evento) {
      evento.preventDefault();
      evento.stopPropagation();
    }
    this.cerrarMenus();
    // Forzar navegación siempre, independientemente de la página actual
    // Usamos navigateByUrl con onSameUrlNavigation: 'reload' para forzar la recarga incluso en la misma URL
    this.router.navigateByUrl('/store-soluciones', { onSameUrlNavigation: 'reload' });
  }

  // Método para navegar a la página de login
  irALogin(): void {
    this.router.navigate(['/login']);
  }
}