import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass',
})
export class MenuComponent {
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
}