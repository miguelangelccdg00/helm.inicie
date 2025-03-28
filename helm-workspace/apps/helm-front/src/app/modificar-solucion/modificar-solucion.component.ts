import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService, StoreSoluciones } from '../services/store-soluciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-modificar-solucion',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './modificar-solucion.component.html',
  styleUrls: ['./modificar-solucion.component.sass']
})

export class ModificarSolucionComponent implements OnInit {

  solucion: StoreSoluciones | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeSolucionesService: StoreSolucionesService
  ) {}

  ngOnInit() {
    const idSolucion = this.route.snapshot.paramMap.get('id');
    if (idSolucion) {
      this.storeSolucionesService.getStoreSolucionById(+idSolucion).subscribe({
        next: (solucion) => {
          console.log('Solución obtenida: ', solucion);
          this.solucion = solucion;
        },
        error: (error) => {
          console.error('Error al obtener la solución: ', error);
        }
      });
    }
  }

  guardarCambios() {
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
    } else {
      console.error('La solución no está definida');
    }
  }
  
}
