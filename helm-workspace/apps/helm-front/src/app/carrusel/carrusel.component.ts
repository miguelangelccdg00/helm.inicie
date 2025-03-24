import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.sass',
})
export class CarruselComponent {

  bloques = [
    { titulo: 'BPM Suite', descripcion: 'Si buscas mejorar la eficiencia, el control y la agilidad de tus procesos operativos.', imagen: 'assets/img1.jpg' },
    { titulo: 'FormaPro', descripcion: 'Un LMS avanzado para mejorar el rendimiento y las habilidades de tus empleados.', imagen: 'assets/img2.jpg' },
    { titulo: 'Portal del empleado', descripcion: 'Si buscas aumentar la productividad y satisfacción de tus empleados.', imagen: 'assets/img3.jpg' },
    { titulo: 'Gestor documental', descripcion: 'Diseñados para controlar tu normativa de sistemas de gestión. Compliance Penal y Compliance Técnico con seguridad y agilidad.', imagen: 'assets/img4.jpg' },
    { titulo: 'Ticketing', descripcion: 'Eficiencia y rapidez en la atención de clientes, solicitudes o incidencias de tu empresa.', imagen: 'assets/img5.jpg' },
    { titulo: 'Canal interno de comunicación', descripcion: 'Seguridad, Confidencialidad y Protección.', imagen: 'assets/img6.jpg' },
  ];
  
  bloquesVisibles = this.bloques.slice(0, 3);
  botonSeleccionado: number | null = null;

  cambiarBloques(indice: number) {

    let bloquesVisibles = [];

    if (indice - 1 >= 0) {
      bloquesVisibles.push(this.bloques[indice - 1]);
    }

    bloquesVisibles.push(this.bloques[indice]);

    if (indice + 1 < this.bloques.length) {
      bloquesVisibles.push(this.bloques[indice + 1]);
    }

    this.bloquesVisibles = bloquesVisibles;
    this.botonSeleccionado = indice;

  }
  
}