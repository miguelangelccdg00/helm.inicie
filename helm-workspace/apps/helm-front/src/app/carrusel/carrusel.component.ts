import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.sass'],
})

export class CarruselComponent implements OnInit, OnDestroy {

  bloques = [
    { titulo: 'BPM Suite', descripcion: 'Si buscas mejorar la eficiencia, el control y la agilidad de tus procesos operativos.', imagen: 'assets/images/img1.png' },
    { titulo: 'FormaPro', descripcion: 'Un LMS avanzado para mejorar el rendimiento y las habilidades de tus empleados.', imagen: 'assets/img2.png' },
    { titulo: 'Portal del empleado', descripcion: 'Si buscas aumentar la productividad y satisfacción de tus empleados.', imagen: 'assets/img3.png' },
    { titulo: 'Gestor documental', descripcion: 'Diseñados para controlar tu normativa de sistemas de gestión. Compliance Penal y Compliance Técnico con seguridad y agilidad.', imagen: 'assets/img4.png' },
    { titulo: 'Ticketing', descripcion: 'Eficiencia y rapidez en la atención de clientes, solicitudes o incidencias de tu empresa.', imagen: 'assets/img5.png' },
    { titulo: 'Canal interno de comunicación', descripcion: 'Seguridad, Confidencialidad y Protección.', imagen: 'assets/img6.png' },
  ];

  bloquesVisibles = this.bloques.slice(0, 3);
  botonSeleccionado: number | null = null;
  private intervaloId: any;

  ngOnInit() {
    this.intervaloId = setInterval(() => {
      this.avanzarBloques();
    }, 4000);
  }

  ngOnDestroy() {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
  }

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

  avanzarBloques() {
    const siguienteIndice = (this.botonSeleccionado !== null ? this.botonSeleccionado : 0) + 1;
    if (siguienteIndice >= this.bloques.length) {
      this.cambiarBloques(0);
    } else {
      this.cambiarBloques(siguienteIndice);
    }
  }

}
