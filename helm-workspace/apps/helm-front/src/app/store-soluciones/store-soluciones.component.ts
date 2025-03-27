import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService, StoreSoluciones } from '../services/store-soluciones.service';
import { MenuComponent } from '../menu/menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-soluciones',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './store-soluciones.component.html',
  styleUrl: './store-soluciones.component.sass',
  encapsulation: ViewEncapsulation.None 
})
export class StoreSolucionesComponent implements OnInit {

  storeSoluciones: StoreSoluciones[] = [];

  constructor(private storeSolucionesService: StoreSolucionesService, private router: Router) {}

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

  irAModificarSolucion(idSolucion: number) {
    this.router.navigate(['modificar-solucion', idSolucion]);
  }

  
}