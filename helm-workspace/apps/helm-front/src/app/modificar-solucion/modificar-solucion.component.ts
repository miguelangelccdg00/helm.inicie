import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSoluciones } from '../services/store-soluciones.service';
import { StoreSolucionesService } from '../services/store-soluciones.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modificar-solucion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modificar-solucion.component.html',
  styleUrl: './modificar-solucion.component.sass',
})

export class ModificarSolucionComponent {

  solucion: StoreSoluciones | null = null;

  constructor(
    private route: ActivatedRoute,
    private storeSolucionesService: StoreSolucionesService
  ) {}

  ngOnInit(): void {
    const idSolucion = this.route.snapshot.paramMap.get('id');
    if (idSolucion) {
      this.storeSolucionesService.getStoreSolucionById(+idSolucion).subscribe({
        next: (solucion) => {
          this.solucion = solucion;
        },
        error: (error) => {
          console.error('Error al obtener la solución: ', error);
        }
      });
    }

  }
}
