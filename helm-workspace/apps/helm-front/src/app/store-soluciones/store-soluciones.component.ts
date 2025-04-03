import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService, StoreSoluciones } from '../services/store-soluciones.service';
import { MenuComponent } from '../menu/menu.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-store-soluciones',
  standalone: true,
  imports: [CommonModule, MenuComponent, FormsModule],
  templateUrl: './store-soluciones.component.html',
  styleUrls: ['./store-soluciones.component.sass'],
  encapsulation: ViewEncapsulation.None 
})
export class StoreSolucionesComponent implements OnInit {

  storeSoluciones: StoreSoluciones[] = [];
  solucionesFiltradas: StoreSoluciones[] = [];
  filtroDescripcion: string = '';
  
  // Variables para el modal
  mostrarModal: boolean = false;
  solucionAEliminar: number | null = null;

  constructor(private storeSolucionesService: StoreSolucionesService, private router: Router) {}

  ngOnInit() {
    this.cargarSoluciones();
  }

  cargarSoluciones() {
    this.storeSolucionesService.getStoreSoluciones().subscribe({
      next: (response) => {
        console.log('StoreSoluciones obtenidos: ', response);
        this.storeSoluciones = response;
        this.solucionesFiltradas = response;
      },
      error: (error) => {
        console.error('Error al obtener storeSoluciones: ', error);
      }
    });
  }

  irAModificarSolucion(idSolucion: number) {
    this.router.navigate(['modificar-solucion', idSolucion]);
  }

  // Método para abrir el modal de confirmación
  confirmarEliminarSolucion(idSolucion: number, event: MouseEvent) {
    event.stopPropagation();
    this.solucionAEliminar = idSolucion;
    this.mostrarModal = true;
  }

  // Método para cancelar la eliminación
  cancelarEliminarSolucion() {
    this.mostrarModal = false;
    this.solucionAEliminar = null;
  }

  // Método para confirmar y ejecutar la eliminación
  eliminarSolucion() {
    if (this.solucionAEliminar) {
      this.storeSolucionesService.deleteStoreSolucion(this.solucionAEliminar).subscribe({
        next: () => {
          this.storeSoluciones = this.storeSoluciones.filter(solucion => solucion.id_solucion !== this.solucionAEliminar);
          this.filtrarSoluciones();
          console.log(`Solución con id ${this.solucionAEliminar} eliminada correctamente`);
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
  
  trackBySolucionId(index: number, solucion: StoreSoluciones): number {
    return solucion.id_solucion;
  }

  filtrarSoluciones() {
    const filtro = this.filtroDescripcion.toLowerCase().trim();
    this.solucionesFiltradas = this.storeSoluciones.filter(solucion =>
      solucion.description.toLowerCase().includes(filtro)
    );
  }
}