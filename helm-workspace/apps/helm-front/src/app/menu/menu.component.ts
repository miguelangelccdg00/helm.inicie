import { Component } from '@angular/core';
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
  
  // Método para seleccionar un elemento del menú
  seleccionarItem(index: number, event: Event): void {
    event.preventDefault();
    this.itemSeleccionado = index;
  }
  
  // Método para verificar si un elemento está seleccionado
  estaSeleccionado(index: number): boolean {
    return this.itemSeleccionado === index;
  }

  // Método para llevar a store soluciones
  irAStoreSoluciones() {
    this.router.navigate(['store-soluciones']);
  }

}