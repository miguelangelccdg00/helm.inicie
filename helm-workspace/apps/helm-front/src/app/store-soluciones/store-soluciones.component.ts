import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService, StoreSoluciones } from '../services/store-soluciones.service';
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

  storeSoluciones: StoreSoluciones[] = [];
  solucionesFiltradas: StoreSoluciones[] = [];
  filtroDescripcion = new FormControl('');
  
  mostrarModal: boolean = false;
  solucionAEliminar: number | null = null;

  constructor(private storeSolucionesService: StoreSolucionesService, private router: Router) {}

  ngOnInit() {
    this.cargarSoluciones();

    this.filtroDescripcion.valueChanges
      .pipe(debounceTime(500))
      .subscribe(filtro => this.filtrarSoluciones(filtro || ''));
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

  confirmarEliminarSolucion(idSolucion: number, event: MouseEvent) {
    event.stopPropagation();
    this.solucionAEliminar = idSolucion;
    this.mostrarModal = true;
  }

  cancelarEliminarSolucion() {
    this.mostrarModal = false;
    this.solucionAEliminar = null;
  }

  eliminarSolucion() {
    if (this.solucionAEliminar) {
      this.storeSolucionesService.deleteStoreSolucion(this.solucionAEliminar).subscribe({
        next: () => {
          this.storeSoluciones = this.storeSoluciones.filter(solucion => solucion.id_solucion !== this.solucionAEliminar);
          this.filtrarSoluciones(this.filtroDescripcion.value || '');
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