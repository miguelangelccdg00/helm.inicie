// Este componente muestra la lista de soluciones del store, permite filtrarlas por descripción,
// navegar a su vista de modificación y eliminarlas con confirmación mediante un modal.

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService } from '../services/store-soluciones.service';
import { StoreSoluciones } from '@modelos-shared/storeSoluciones';
import { MenuComponent } from '../menu/menu.component';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-store-soluciones',
  standalone: true,
  imports: [CommonModule, MenuComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './store-soluciones.component.html',
  styleUrls: ['./store-soluciones.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class StoreSolucionesComponent implements OnInit {

  // Lista original y filtrada de soluciones
  storeSoluciones: StoreSoluciones[] = [];
  solucionesFiltradas: StoreSoluciones[] = [];

  // Control del campo de búsqueda
  filtroDescripcion = new FormControl('');

  // Control de visibilidad del modal de confirmación de eliminación
  mostrarModal: boolean = false;
  solucionAEliminar: number | null = null;

  // Inyección del servicio y router
  constructor(private storeSolucionesService: StoreSolucionesService, private router: Router) {}

  ngOnInit() {
    // Al iniciar, cargamos todas las soluciones y configuramos el filtro con debounce
    this.cargarSoluciones();

    this.filtroDescripcion.valueChanges
      .pipe(debounceTime(500))
      .subscribe(filtro => this.filtrarSoluciones(filtro || ''));
  }

  // Llama al servicio para obtener todas las soluciones del backend
  cargarSoluciones() {
    this.storeSolucionesService.getStoreSoluciones().subscribe({
      next: (response) => {
        this.storeSoluciones = response;
        this.solucionesFiltradas = response;
      },
      error: (error) => {
        console.error('Error al obtener storeSoluciones: ', error);
      }
    });
  }

  // Redirige a la vista de modificación de la solución seleccionada
  irAModificarSolucion(idSolucion: number) {
    this.router.navigate(['modificar-solucion', idSolucion]);
  }

  // Abre el modal de confirmación de eliminación
  confirmarEliminarSolucion(idSolucion: number, event: MouseEvent) {
    event.stopPropagation(); // Previene que se active la navegación al hacer clic
    this.solucionAEliminar = idSolucion;
    this.mostrarModal = true;
  }

  // Cierra el modal sin eliminar
  cancelarEliminarSolucion() {
    this.mostrarModal = false;
    this.solucionAEliminar = null;
  }

  // Llama al servicio para eliminar la solución confirmada
  eliminarSolucion() {
    if (this.solucionAEliminar) {
      this.storeSolucionesService.deleteStoreSolucion(this.solucionAEliminar).subscribe({
        next: () => {
          // Actualiza la lista tras eliminar
          this.storeSoluciones = this.storeSoluciones.filter(solucion => solucion.id_solucion !== this.solucionAEliminar);
          this.filtrarSoluciones(this.filtroDescripcion.value || '');
          this.mostrarModal = false;
          this.solucionAEliminar = null;
        },
        error: (error) => {
          console.error('Error al eliminar solución: ', error);
          this.mostrarModal = false;
          this.solucionAEliminar = null;
        }
      });
    }
  }

  // Optimiza la renderización con trackBy
  trackBySolucionId(index: number, solucion: StoreSoluciones): number {
    return solucion.id_solucion;
  }

  // Filtra las soluciones por descripción con mínimo de 3 caracteres
  filtrarSoluciones(filtro: string) {
    const filtroLimpio = filtro.toLowerCase().trim();

    if (filtroLimpio.length < 3) {
      this.solucionesFiltradas = this.storeSoluciones;
      return;
    }

    this.solucionesFiltradas = this.storeSoluciones.filter(solucion =>
      solucion.description.toLowerCase().includes(filtroLimpio)
    );
  }
}
