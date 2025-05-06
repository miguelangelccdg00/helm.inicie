import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { CarruselComponent } from '../carrusel/carrusel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoginComponent, CarruselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  
  mostrarCarrusel: boolean = true;

  constructor() {
    // Verifica el tamaño inicial de la pantalla al cargar el componente
    this.checkScreenSize(window.innerWidth);
  }

  // Escucha los cambios de tamaño de la ventana para mostrar u ocultar el carrusel
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize((event.target as Window).innerWidth);
  }

  // Si el ancho es mayor a 500px, se muestra el carrusel
  checkScreenSize(width: number) {
    this.mostrarCarrusel = width > 500;
  }
}
