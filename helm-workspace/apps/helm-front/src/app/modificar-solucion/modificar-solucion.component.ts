import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService, StoreSoluciones, StoreBeneficios, StoreProblemas } from '../services/store-soluciones.service';
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

  solucion: StoreSoluciones | null = null;

  nuevoProblema: StoreProblemas = { titulo: '', description: '' };
  buscadorProblema: string = '';
  problemas: StoreProblemas[] = [];
  allProblemas: StoreProblemas[] = [];
  problemasFiltrados: StoreProblemas[] = [];
  problemaSeleccionado: StoreProblemas | null = null;
  mostrarCrearProblema: boolean = false;
  mostrarOpcionesProblema: boolean = false;
  mostrarBotonCrearProblema: boolean = true;
  problemaAEliminar: number | null = null;

  nuevoBeneficio: StoreBeneficios = { titulo: '', description: '' };
  buscadorBeneficio: string = '';
  beneficios: StoreBeneficios[] = [];
  allBeneficios: StoreBeneficios[] = [];
  beneficiosFiltrados: StoreBeneficios[] = [];
  beneficioSeleccionado: StoreBeneficios | null = null;
  mostrarOpciones: boolean = false;
  mostrarCrearBeneficio: boolean = false;
  mostrarBotonCrear: boolean = true;
  beneficioAEliminar: number | null = null;

  mostrarModalProblema: boolean = false;
  mostrarModalBeneficio: boolean = false;

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
    const idSolucion = this.route.snapshot.paramMap.get('id');
    if (idSolucion) {
      this.storeSolucionesService.getStoreSolucionById(+idSolucion).subscribe({
        next: (solucion: StoreSoluciones) => {
          this.solucion = solucion;
          if (!this.solucion.problemas) {
            this.solucion.problemas = [];
          }

          this.storeSolucionesService.getProblemasBySolucion(this.solucion.id_solucion).subscribe({
            next: (problemas: StoreProblemas[]) => {
              this.problemas = problemas;
              this.solucion!.problemas = problemas;
            },
            error: (error: any) => {
              console.error('Error al obtener los problemas: ', error);
            }
          });

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

      this.storeSolucionesService.getAllProblemas().subscribe({
        next: (problemas: StoreProblemas[]) => {
          console.log('Problemas disponibles: ', problemas);
          this.allProblemas = problemas;
          this.problemasFiltrados = problemas;
        },
        error: (error: any) => {
          console.error('Error al obtener los problemas: ', error);
        }
      });

      this.storeSolucionesService.getAllBeneficios().subscribe({
        next: (beneficios: StoreBeneficios[]) => {
          console.log('Beneficios disponibles: ', beneficios);
          this.allBeneficios = beneficios;
          this.beneficiosFiltrados = beneficios;
        },
        error: (error: any) => {
          console.error('Error al obtener los beneficios: ', error);
        }
      });
    }
  }

  guardarCambios() {
    if (this.solucion) {
      if (this.problemas.length > 0 && this.problemas[0].description) {
        this.solucion.problemaPragma = this.problemas[0].description;
      }

      this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
        next: () => {
          console.log('Solución actualizada correctamente');

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

          this.problemas.forEach(problema => {
            if (problema.id_problema) {
              observables.push(
                this.storeSolucionesService.asociarProblemaASolucion(
                  this.solucion!.id_solucion,
                  problema.id_problema
                )
              );
            }
          });

          if (observables.length > 0) {
            forkJoin(observables).subscribe({
              next: () => {
                console.log('Todos los beneficios y problemas han sido asociados correctamente');
                this.router.navigate(['/store-soluciones']);
              },
              error: (error) => {
                console.error('Error al asociar beneficios o problemas:', error);
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

  seleccionarProblema(problema: StoreProblemas) {
    this.buscadorProblema = problema.description;
    this.problemaSeleccionado = problema;
    this.mostrarOpcionesProblema = false;
  }

  agregarBeneficio() {
    if (this.buscadorBeneficio && this.solucion) {
      const beneficioSeleccionado = this.beneficioSeleccionado ||
        this.allBeneficios.find(
          b => b.description.toLowerCase() === this.buscadorBeneficio.toLowerCase()
        );

      if (beneficioSeleccionado) {
        const yaExiste = this.beneficios.some(
          b => b.id_beneficio === beneficioSeleccionado.id_beneficio
        );

        if (!yaExiste) {
          this.beneficios.push(beneficioSeleccionado);
          this.solucion.beneficios = this.beneficios;

          this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
            next: () => {
              console.log('Beneficio agregado correctamente a la solución');
            },
            error: (error: any) => {
              console.error('Error al agregar beneficio:', error);
            }
          });

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

  agregarProblema() {
    if (this.buscadorProblema && this.solucion) {
      const problemaSeleccionado = this.problemaSeleccionado ||
        this.allProblemas.find(
          p => p.description.toLowerCase() === this.buscadorProblema.toLowerCase()
        );

      if (problemaSeleccionado) {
        const yaExiste = this.problemas.some(
          p => p.id_problema === problemaSeleccionado.id_problema
        );

        if (!yaExiste) {
          if (problemaSeleccionado.titulo) {
            this.solucion.problemaTitle = problemaSeleccionado.titulo;
          }

          this.solucion.problemaPragma = problemaSeleccionado.description;
          console.log('Estableciendo problemaPragma:', problemaSeleccionado.description);

          this.problemas.push(problemaSeleccionado);
          this.solucion.problemas = this.problemas;

          this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
            next: () => {
              console.log('Problema agregado correctamente a la solución');
              console.log('Valores actualizados:', {
                problemaTitle: this.solucion?.problemaTitle,
                problemaPragma: this.solucion?.problemaPragma
              });

              if (problemaSeleccionado.id_problema) {
                this.storeSolucionesService.asociarProblemaASolucion(
                  this.solucion!.id_solucion,
                  problemaSeleccionado.id_problema
                ).subscribe({
                  next: () => {
                    console.log('Problema asociado correctamente');

                    this.storeSolucionesService.getStoreSolucionById(this.solucion!.id_solucion).subscribe({
                      next: (solucionActualizada) => {
                        console.log('Solución después de asociar problema:', solucionActualizada);
                      }
                    });
                  },
                  error: (error) => {
                    console.error('Error al asociar problema:', error);
                  }
                });
              }
            },
            error: (error: any) => {
              console.error('Error al agregar problema:', error);
            }
          });

          this.buscadorProblema = '';
          this.problemaSeleccionado = null;
        } else {
          console.error('Este problema ya está agregado');
        }
      } else {
        console.error('Problema no encontrado');
      }
    } else {
      console.error('Debe seleccionar un problema antes de agregarlo');
    }
  }

  eliminarBeneficio() {
    if (this.beneficioAEliminar !== null) {
      this.storeSolucionesService.deleteBeneficio(this.beneficioAEliminar).subscribe({
        next: () => {
          console.log('Beneficio eliminado correctamente de la base de datos');
  
          if (this.solucion && this.solucion.beneficios) {
            // Actualizar la lista local de beneficios
            this.beneficios = this.beneficios.filter(
              beneficio => beneficio.id_beneficio !== this.beneficioAEliminar
            );
            
            // Actualizar también la lista en el objeto solución
            this.solucion.beneficios = this.beneficios;
            
            // Guardar los cambios en la solución para asegurar que se actualiza en la base de datos
            this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
              next: () => {
                console.log('Solución actualizada después de eliminar beneficio');
              },
              error: (err) => {
                console.error('Error al actualizar la solución después de eliminar beneficio:', err);
              }
            });
          }
  
          this.beneficioAEliminar = null;
          this.mostrarModalBeneficio = false;
        },
        error: (error) => {
          console.error('Error al eliminar el beneficio:', error);
          this.mostrarModalBeneficio = false;
        }
      });
    }
  }
  

  eliminarProblema() {
    if (this.problemaAEliminar !== null) {
      this.storeSolucionesService.deleteProblema(this.problemaAEliminar).subscribe({
        next: () => {
          console.log('Problema eliminado correctamente de la base de datos');

          if (this.solucion && this.solucion.problemas) {
            // Filtrar el problema eliminado de la lista local
            this.problemas = this.problemas.filter(problema => 
              problema.id_problema !== this.problemaAEliminar
            );
            
            // Actualizar también la lista en el objeto solución
            this.solucion.problemas = this.problemas;
            
            // Si eliminamos todos los problemas o el problema principal, limpiar problemaPragma
            if (this.problemas.length === 0) {
              this.solucion.problemaPragma = null;
              this.solucion.problemaTitle = null;
            }
            
            // Guardar los cambios en la solución para asegurar que se actualiza en la base de datos
            this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
              next: () => {
                console.log('Solución actualizada después de eliminar problema');
              },
              error: (err) => {
                console.error('Error al actualizar la solución después de eliminar problema:', err);
              }
            });
          }

          this.problemaAEliminar = null;
          this.mostrarModalProblema = false;
        },
        error: (error) => {
          console.error('Error al eliminar el problema:', error);
          this.mostrarModalProblema = false;
        }
      });
    }
  }


  filtrarBeneficios() {
    const filtro = this.buscadorBeneficio.toLowerCase().trim();
    this.beneficiosFiltrados = this.allBeneficios.filter(beneficio =>
      beneficio.description.toLowerCase().includes(filtro)
    );
  }

  filtrarProblemas() {
    const filtro = this.buscadorProblema.toLowerCase().trim();
    this.problemasFiltrados = this.allProblemas.filter(problema =>
      problema.description.toLowerCase().includes(filtro)
    );
  }

  crearNuevoBeneficio() {
    this.mostrarCrearBeneficio = false;
    this.mostrarBotonCrear = true;

    if (!this.nuevoBeneficio.description || !this.solucion) {
      console.error('Debe ingresar una descripción y la solución debe estar cargada');
      return;
    }

    this.storeSolucionesService.createBeneficio(this.solucion.id_solucion, this.nuevoBeneficio).subscribe({
      next: (response) => {
        console.log('Beneficio creado:', response);

        const beneficioCreado: StoreBeneficios = {
          id_beneficio: response.beneficio.id_beneficio,
          titulo: this.nuevoBeneficio.titulo,
          description: this.nuevoBeneficio.description
        };

        this.allBeneficios.push(beneficioCreado);
        this.filtrarBeneficios();

        this.nuevoBeneficio = { titulo: '', description: '' };
      },
      error: (error) => {
        console.error('Error al crear el beneficio:', error);
      }
    });
  }

  crearNuevoProblema() {
    this.mostrarCrearProblema = false;
    this.mostrarBotonCrearProblema = true;

    if (!this.nuevoProblema.description || !this.solucion) {
      console.error('Debe ingresar una descripción y la solución debe estar cargada');
      return;
    }

    this.storeSolucionesService.createProblema(this.solucion.id_solucion, this.nuevoProblema).subscribe({
      next: (response) => {
        console.log('Problema creado:', response);

        const problemaCreado: StoreProblemas = {
          id_problema: response.problema.id_problema,
          titulo: this.nuevoProblema.titulo,
          description: this.nuevoProblema.description
        };

        this.allProblemas.push(problemaCreado);
        this.filtrarProblemas();

        this.nuevoProblema = { titulo: '', description: '' };
      },
      error: (error) => {
        console.error('Error al crear el problema:', error);
      }
    });
  }

  confirmarEliminarProblema(idProblema: number, event: MouseEvent) {
    event.stopPropagation();
    this.problemaAEliminar = idProblema;
    this.mostrarModalProblema = true;
  }

  cancelarEliminarProblema() {
    this.mostrarModalProblema = false;
    this.problemaAEliminar = null;
  }

  confirmarEliminarBeneficio(idBeneficio: number, event: MouseEvent) {
    event.stopPropagation();
    this.beneficioAEliminar = idBeneficio;
    this.mostrarModalBeneficio = true;
  }

  cancelarEliminarBeneficio() {
    this.mostrarModalBeneficio = false;
    this.problemaAEliminar = null;
  }

}