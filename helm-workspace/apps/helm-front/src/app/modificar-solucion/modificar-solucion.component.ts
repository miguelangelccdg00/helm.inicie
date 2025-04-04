import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService, StoreSoluciones, StoreBeneficios, StoreProblemas, StoreCaracteristicas } from '../services/store-soluciones.service';
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

  nuevaCaracteristica: StoreCaracteristicas = { titulo: '', description: '' };
  buscadorCaracteristica: string = '';
  caracteristicas: StoreCaracteristicas[] = [];
  allCaracteristicas: StoreCaracteristicas[] = [];
  caracteristicasFiltradas: StoreCaracteristicas[] = [];
  caracteristicaSeleccionada: StoreCaracteristicas | null = null;
  mostrarCrearCaracteristica: boolean = false;
  mostrarOpcionesCaracteristicas: boolean = false;
  mostrarBotonCrearCaracteristica: boolean = true;
  caracteristicaAEliminar: number | null = null;


  mostrarModalProblema: boolean = false;
  mostrarModalBeneficio: boolean = false;
  mostrarModalCaracteristica: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeSolucionesService: StoreSolucionesService
  ) { }

  @HostListener('document:click', ['$event'])
  clickFuera(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.buscador-selector-container')) {
      this.mostrarOpcionesProblema = false;
      this.mostrarOpciones = false;
    }
  }

  ngOnInit() {
    const idSolucion = this.route.snapshot.paramMap.get('id');
    if (idSolucion) {
      this.storeSolucionesService.getStoreSolucionById(+idSolucion).subscribe({
        next: (solucion: StoreSoluciones) => {
          this.solucion = solucion;
          if (!this.solucion.problemas) this.solucion.problemas = [];
          if (!this.solucion.beneficios) this.solucion.beneficios = [];
          if (!this.solucion.caracteristicas) this.solucion.caracteristicas = [];

          this.storeSolucionesService.getProblemasBySolucion(this.solucion.id_solucion).subscribe({
            next: (problemas: StoreProblemas[]) => {
              this.problemas = problemas;
              this.solucion!.problemas = problemas;
            },
            error: (error: any) => console.error('Error al obtener los problemas: ', error)
          });

          this.storeSolucionesService.getBeneficiosBySolucion(this.solucion.id_solucion).subscribe({
            next: (beneficios: StoreBeneficios[]) => {
              this.beneficios = beneficios;
              this.solucion!.beneficios = beneficios;
            },
            error: (error: any) => console.error('Error al obtener los beneficios: ', error)
          });

          this.storeSolucionesService.getCaracteristicasBySolucion(this.solucion.id_solucion).subscribe({
            next: (caracteristicas: StoreCaracteristicas[]) => {
              this.caracteristicas = caracteristicas;
              this.solucion!.caracteristicas = caracteristicas;
            },
            error: (error: any) => console.error('Error al obtener las características: ', error)
          });
        },
        error: (error: any) => console.error('Error al obtener la solución: ', error)
      });

      this.storeSolucionesService.getAllProblemas().subscribe({
        next: (problemas: StoreProblemas[]) => {
          this.allProblemas = problemas;
          this.problemasFiltrados = problemas;
        },
        error: (error: any) => console.error('Error al obtener los problemas: ', error)
      });

      this.storeSolucionesService.getAllBeneficios().subscribe({
        next: (beneficios: StoreBeneficios[]) => {
          this.allBeneficios = beneficios;
          this.beneficiosFiltrados = beneficios;
        },
        error: (error: any) => console.error('Error al obtener los beneficios: ', error)
      });

      this.storeSolucionesService.getAllCaracteristicas().subscribe({
        next: (caracteristicas: StoreCaracteristicas[]) => {
          this.allCaracteristicas = caracteristicas;
          this.caracteristicasFiltradas = caracteristicas;
        },
        error: (error: any) => console.error('Error al obtener las características: ', error)
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

          this.caracteristicas.forEach(caracteristica => {
            if (caracteristica.id_caracteristica) {
              observables.push(
                this.storeSolucionesService.asociarCaracteristicaASolucion(
                  this.solucion!.id_solucion,
                  caracteristica.id_caracteristica
                )
              );
            }
          });

          if (observables.length > 0) {
            forkJoin(observables).subscribe({
              next: () => {
                console.log('Beneficios, problemas y características asociados correctamente');
                this.router.navigate(['/store-soluciones']);
              },
              error: (error) => console.error('Error al asociar beneficios, problemas o características:', error)
            });
          } else {
            this.router.navigate(['/store-soluciones']);
          }
        },
        error: (error: any) => console.error('Error al actualizar la solución:', error)
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

  seleccionarCaracteristica(caracteristica: StoreCaracteristicas) {
    this.buscadorCaracteristica = caracteristica.description;
    this.caracteristicaSeleccionada = caracteristica;
    this.mostrarOpcionesCaracteristicas = false;
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

  agregarCaracteristica() {
    if (this.buscadorCaracteristica && this.solucion) {
      const caracteristicaSeleccionada = this.caracteristicaSeleccionada ||
        this.allCaracteristicas.find(
          c => c.description.toLowerCase() === this.buscadorCaracteristica.toLowerCase()
        );

      if (caracteristicaSeleccionada) {
        const yaExiste = this.caracteristicas.some(
          c => c.id_caracteristica === caracteristicaSeleccionada.id_caracteristica
        );

        if (!yaExiste) {
          this.caracteristicas.push(caracteristicaSeleccionada);
          this.solucion.caracteristicas = this.caracteristicas;

          this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
            next: () => {
              console.log('Característica agregada correctamente a la solución');
            },
            error: (error: any) => {
              console.error('Error al agregar característica:', error);
            }
          });

          this.buscadorCaracteristica = '';
          this.caracteristicaSeleccionada = null;
        } else {
          console.error('Esta característica ya está agregada');
        }
      } else {
        console.error('Característica no encontrada');
      }
    } else {
      console.error('Debe seleccionar una característica antes de agregarla');
    }
  }

  eliminarBeneficio() {
    if (this.beneficioAEliminar !== null) {
      this.storeSolucionesService.deleteBeneficio(this.beneficioAEliminar).subscribe({
        next: () => {
          console.log('Beneficio eliminado correctamente de la base de datos');

          if (this.solucion && this.solucion.beneficios) {
            this.beneficios = this.beneficios.filter(
              beneficio => beneficio.id_beneficio !== this.beneficioAEliminar
            );

            this.solucion.beneficios = this.beneficios;

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
            this.problemas = this.problemas.filter(problema =>
              problema.id_problema !== this.problemaAEliminar
            );

            this.solucion.problemas = this.problemas;

            if (this.problemas.length === 0) {
              this.solucion.problemaPragma = null;
              this.solucion.problemaTitle = null;
            }

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

  eliminarCaracteristica() {
    if (this.caracteristicaAEliminar !== null) {
      this.storeSolucionesService.deleteProblema(this.caracteristicaAEliminar).subscribe({
        next: () => {
          console.log('Problema eliminado correctamente de la base de datos');

          if (this.solucion && this.solucion.caracteristicas) {
            this.caracteristicas = this.caracteristicas.filter(caracteristica =>
              caracteristica.id_caracteristica !== this.caracteristicaAEliminar
            );

            this.solucion.caracteristicas = this.caracteristicas;

            if (this.caracteristicas.length === 0) {
              this.solucion.caracteristicasPragma = null;
              this.solucion.caracteristicasTitle = null;
            }

            this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
              next: () => {
                console.log('Solución actualizada después de eliminar característica');
              },
              error: (err) => {
                console.error('Error al actualizar la solución después de eliminar característica:', err);
              }
            });
          }

          this.caracteristicaAEliminar = null;
          this.mostrarModalCaracteristica = false;
        },
        error: (error) => {
          console.error('Error al eliminar la característica:', error);
          this.mostrarModalCaracteristica = false;
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

  filtrarCaracteristicas() {
    const filtro = this.buscadorCaracteristica.toLowerCase().trim();
    this.caracteristicasFiltradas = this.allCaracteristicas.filter(caracteristica =>
      caracteristica.description.toLowerCase().includes(filtro)
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

  crearNuevaCaracteristica() {
    this.mostrarCrearProblema = false;
    this.mostrarBotonCrearCaracteristica = true;

    if (!this.nuevaCaracteristica.description || !this.solucion) {
      console.error('Debe ingresar una descripción y la solución debe estar cargada');
      return;
    }

    this.storeSolucionesService.createCaracteristica(this.solucion.id_solucion, this.nuevaCaracteristica).subscribe({
      next: (response) => {
        console.log('Característica creada:', response);

        const caracteristicaCreada: StoreCaracteristicas = {
          id_caracteristica: response.caracteristica.id_caracteristica,
          titulo: this.nuevaCaracteristica.titulo,
          description: this.nuevaCaracteristica.description
        };

        this.allCaracteristicas.push(caracteristicaCreada);
        this.filtrarCaracteristicas();

        this.nuevaCaracteristica = { titulo: '', description: '' };
      },
      error: (error) => {
        console.error('Error al crear la característica:', error);
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

  confirmarEliminarCaracteristica(idCaracteristica: number, event: MouseEvent) {
    event.stopPropagation();
    this.caracteristicaAEliminar = idCaracteristica;
    this.mostrarModalCaracteristica = true;
  }

  cancelarEliminarCaracteristica() {
    this.mostrarModalCaracteristica = false;
    this.caracteristicaAEliminar = null;
  }

}