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

  beneficios: StoreBeneficios[] = [];

  solucion: StoreSoluciones | null = null;

  mostrarFormularioBeneficio = false;
  nuevoBeneficioTitulo = '';
  nuevoBeneficioDescripcion = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeSolucionesService: StoreSolucionesService
  ) { }

  ngOnInit() {
    const idSolucion = this.route.snapshot.paramMap.get('id');
    if (idSolucion) {
      this.storeSolucionesService.getStoreSolucionById(+idSolucion).subscribe({
        next: (solucion) => {
          console.log('Solución obtenida: ', solucion);
          this.solucion = solucion;

          if (!this.solucion.beneficios) {
            this.solucion.beneficios = [];
          }

          this.storeSolucionesService.getBeneficiosBySolucion(this.solucion.id_solucion).subscribe({
            next: (beneficios) => {
              console.log('Beneficios obtenidos: ', beneficios);
              this.beneficios = beneficios;
              this.solucion!.beneficios = beneficios;
            },
            error: (error) => {
              console.error('Error al obtener los beneficios: ', error);
            }
          });
        },
        error: (error) => {
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
        error: (error) => {
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
    if (this.nuevoBeneficioTitulo && this.nuevoBeneficioDescripcion && this.solucion) {
      const nuevoBeneficio: StoreBeneficios = {
        titulo: this.nuevoBeneficioTitulo,
        description: this.nuevoBeneficioDescripcion
      };

      this.storeSolucionesService.createBeneficio(this.solucion.id_solucion, nuevoBeneficio).subscribe({
        next: (response) => {
          console.log('Beneficio creado correctamente:', response);

          if (response && response.id_beneficio) {
            nuevoBeneficio.id_beneficio = response.id_beneficio;
          }

          this.beneficios.push(nuevoBeneficio);
          if (this.solucion) {
            this.solucion.beneficios = this.beneficios;

            this.solucion.titleBeneficio = nuevoBeneficio.titulo || null;
            this.solucion.beneficiosPragma = nuevoBeneficio.description;

            this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
              next: () => {
                console.log('Campos de beneficio actualizados en la solución');
              },
              error: (error) => {
                console.error('Error al actualizar campos de beneficio en la solución:', error);
              }
            });
          }

          this.nuevoBeneficioTitulo = '';
          this.nuevoBeneficioDescripcion = '';
          this.mostrarFormularioBeneficio = false;
        },
        error: (error) => {
          console.error('Error al crear el beneficio:', error);
        }
      });
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
        error: (error) => {
          console.error('Error al eliminar el beneficio:', error);
        }
      });
    } else {
      this.beneficios.splice(index, 1);
    }
  }
  
}