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
    this.checkScreenSize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize((event.target as Window).innerWidth);
  }

  checkScreenSize(width: number) {
    this.mostrarCarrusel = width > 500;
  }
}
