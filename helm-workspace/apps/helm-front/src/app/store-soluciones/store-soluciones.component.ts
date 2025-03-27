import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ngOnInit, ngOnDestroy } from '@angular/core';
import { StoreSolucionesService } from '../services/store-soluciones.service'

@Component({
  selector: 'app-store-soluciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-soluciones.component.html',
  styleUrl: './store-soluciones.component.sass',
})

export class StoreSolucionesComponent {

  storeSoluciones: StoreSoluciones[] = [];

  constructor(private: storeSolucionesService: StoreSolucionesService) {}

  ngOnInit() {
    
    this.storeSolucionesService.getStoreSoluciones().subscribe({
      next: (response) => {
        console.log('StoreSoluciones obtenidos: ', response);
        this.storeSoluciones = response;
      },
      error: (error) => {
        console.error('Error al obtener storeSoluciones: ', error);
      }
    });
  }

}
