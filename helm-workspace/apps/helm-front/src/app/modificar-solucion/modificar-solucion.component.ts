import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService, StoreSoluciones, StoreBeneficios } from '../services/store-soluciones.service';
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

  buscadorBeneficio: string = '';
  tipoSeleccionado: string = ''; 
  beneficios: StoreBeneficios[] = [];
  allBeneficios: StoreBeneficios[] = [];
  solucion: StoreSoluciones | null = null;
  beneficiosFiltrados: StoreBeneficios[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeSolucionesService: StoreSolucionesService
  ) { }

  ngOnInit() {
    // Obtener los beneficios disponibles
    this.storeSolucionesService.getAllBeneficios().subscribe({
      next: (beneficios: StoreBeneficios[]) => {
        console.log('Beneficios disponibles: ', beneficios);
        this.allBeneficios = beneficios;
      },
      error: (error: any) => {
        console.error('Error al obtener los beneficios: ', error);
      }
    });

    const idSolucion = this.route.snapshot.paramMap.get('id');
    if (idSolucion) {
      this.storeSolucionesService.getStoreSolucionById(+idSolucion).subscribe({
        next: (solucion: StoreSoluciones) => {
          console.log('Solución obtenida: ', solucion);
          this.solucion = solucion;
          
          // Asegurarse de que los beneficios existan
          if (!this.solucion.beneficios) {
            this.solucion.beneficios = [];
          }

          this.storeSolucionesService.getBeneficiosBySolucion(this.solucion.id_solucion).subscribe({
            next: (beneficios: StoreBeneficios[]) => {
              console.log('Beneficios obtenidos: ', beneficios);
              this.beneficios = beneficios;
              this.solucion!.beneficios = beneficios;
            },
            error: (error: any) => {
              console.error('Error al obtener los beneficios: ', error);
            }
          });
        },
        error: (error: any) => {
          console.error('Error al obtener la solución: ', error);
        }
      });
    }
  }

  guardarCambios() {
    if (this.solucion) {
      this.solucion.beneficios = this.beneficios;
  
      this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
        next: () => {
          console.log('Solución actualizada correctamente con sus beneficios');
          this.router.navigate(['/store-soluciones']);
        },
        error: (error: any) => {
          console.error('Error al actualizar la solución:', error);
        }
      });
    } else {
      console.error('La solución no está definida');
    }
  }

  cancelar() {
    this.router.navigate(['/store-soluciones']);
  }

  agregarBeneficio() {
    if (this.tipoSeleccionado && this.solucion) {
      const beneficioSeleccionado = this.allBeneficios.find(b => b.id_beneficio === +this.tipoSeleccionado);
  
      if (beneficioSeleccionado) {
        this.beneficios.push(beneficioSeleccionado);
        if (this.solucion) {
          this.solucion.beneficios = this.beneficios;
  
          this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
            next: () => {
              console.log('Beneficio agregado correctamente a la solución');
            },
            error: (error: any) => {
              console.error('Error al agregar beneficio:', error);
            }
          });
        }
  
        this.tipoSeleccionado = '';
      } else {
        console.error('Beneficio no encontrado');
      }
    } else {
      console.error('Debe seleccionar un beneficio antes de agregarlo');
    }
  }
  
  eliminarBeneficio(index: number) {
    const beneficio = this.beneficios[index];
  
    if (beneficio?.id_beneficio) {
      this.storeSolucionesService.deleteBeneficio(beneficio.id_beneficio).subscribe({
        next: () => {
          console.log('Beneficio eliminado correctamente de la base de datos');
          this.beneficios.splice(index, 1);
        },
        error: (error: any) => {
          console.error('Error al eliminar el beneficio:', error);
        }
      });
    } else {
      this.beneficios.splice(index, 1);
    }
  }

  filtrarBeneficios() {
    const filtro = this.buscadorBeneficio.toLowerCase().trim();
    this.beneficiosFiltrados = this.allBeneficios.filter(beneficio =>
      beneficio.description.toLowerCase().includes(filtro)
    );
  }
}