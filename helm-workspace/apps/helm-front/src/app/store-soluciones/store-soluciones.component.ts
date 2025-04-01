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


  constructor(private storeSolucionesService: StoreSolucionesService, private router: Router) {}

  ngOnInit() {
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

  eliminarSolucion(idSolucion: number, event: MouseEvent) {
    event.stopPropagation();
  
    if (confirm(`¿Está seguro de que desea eliminar la solución con id ${idSolucion}?`)) {
      this.storeSolucionesService.deleteStoreSolucion(idSolucion).subscribe({
        next: () => {
          this.storeSoluciones = this.storeSoluciones.filter(solucion => solucion.id_solucion !== idSolucion);
          this.filtrarSoluciones();
          console.log(`Solución con id ${idSolucion} eliminada correctamente`);
        },
        error: (error) => {
          console.error('Error al eliminar solución: ', error);
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