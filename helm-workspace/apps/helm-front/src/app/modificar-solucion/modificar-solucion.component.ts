import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService, StoreSoluciones, StoreBeneficios } from '../services/store-soluciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';
import { forkJoin, Observable } from 'rxjs';

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
  beneficioSeleccionado: StoreBeneficios | null = null;
  mostrarOpciones: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeSolucionesService: StoreSolucionesService
  ) { }

  @HostListener('document:click', ['$event'])
  clickFuera(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      this.mostrarOpciones = false;
    }
  }

  ngOnInit() {
    // Obtener los beneficios disponibles
    this.storeSolucionesService.getAllBeneficios().subscribe({
      next: (beneficios: StoreBeneficios[]) => {
        console.log('Beneficios disponibles: ', beneficios);
        this.allBeneficios = beneficios;
        this.beneficiosFiltrados = beneficios; // Inicializar con todos los beneficios
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
      // Primero actualizamos la solución
      this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
        next: () => {
          console.log('Solución actualizada correctamente');
          
          // Ahora asociamos cada beneficio a la solución
          const observables: Observable<any>[] = [];
          
          this.beneficios.forEach(beneficio => {
            if (beneficio.id_beneficio) {
              observables.push(
                this.storeSolucionesService.asociarBeneficioASolucion(
                  this.solucion!.id_solucion, 
                  beneficio.id_beneficio
                )
              );
            }
          });
          
          if (observables.length > 0) {
            // Utilizamos forkJoin para esperar a que todas las peticiones se completen
            forkJoin(observables).subscribe({
              next: () => {
                console.log('Todos los beneficios han sido asociados correctamente');
                this.router.navigate(['/store-soluciones']);
              },
              error: (error) => {
                console.error('Error al asociar beneficios:', error);
              }
            });
          } else {
            this.router.navigate(['/store-soluciones']);
          }
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

  seleccionarBeneficio(beneficio: StoreBeneficios) {
    this.buscadorBeneficio = beneficio.description;
    this.beneficioSeleccionado = beneficio;
    this.mostrarOpciones = false;
  }

  agregarBeneficio() {
    if (this.buscadorBeneficio && this.solucion) {
      // Buscar el beneficio que coincide con el texto ingresado
      const beneficioSeleccionado = this.beneficioSeleccionado || 
        this.allBeneficios.find(
          b => b.description.toLowerCase() === this.buscadorBeneficio.toLowerCase()
        );

      if (beneficioSeleccionado) {
        // Verificar si el beneficio ya está agregado
        const yaExiste = this.beneficios.some(
          b => b.id_beneficio === beneficioSeleccionado.id_beneficio
        );

        if (!yaExiste) {
          this.beneficios.push(beneficioSeleccionado);
          this.solucion.beneficios = this.beneficios;
          
          // Actualizar la solución en la base de datos
          this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
            next: () => {
              console.log('Beneficio agregado correctamente a la solución');
            },
            error: (error: any) => {
              console.error('Error al agregar beneficio:', error);
            }
          });
          
          // Limpiar el campo después de agregar
          this.buscadorBeneficio = '';
          this.beneficioSeleccionado = null;
        } else {
          console.error('Este beneficio ya está agregado');
        }
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