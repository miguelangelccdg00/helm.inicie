import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSoluciones } from '../services/store-soluciones.service';
import { StoreSolucionesService } from '../services/store-soluciones.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router,
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

  guardarCambios(): void {
    if (this.solucion) {
      this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
        next: () => {
          console.log('Solución actualizada correctamente');
          this.router.navigate(['/store-soluciones']);
        },
        error: (error) => {
          console.error('Error al actualizar la solución:', error);
        }
      });
    }
  }
}