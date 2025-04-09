import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService, StoreSoluciones, StoreBeneficios, StoreProblemas, StoreCaracteristicas, StoreAmbitos } from '../services/store-soluciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';
import { forkJoin, Observable } from 'rxjs';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-modificar-solucion',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent, TableModule, InputTextModule, FloatLabelModule],
  templateUrl: './modificar-solucion.component.html',
  styleUrls: ['./modificar-solucion.component.sass']
})

export class ModificarSolucionComponent implements OnInit {

  @ViewChild('scrollProblemas', { static: false }) scrollProblemas: ElementRef | undefined;
  @ViewChild('scrollBeneficios', { static: false }) scrollBeneficios: ElementRef | undefined;
  @ViewChild('scrollCaracteristicas', { static: false }) scrollCaracteristicas: ElementRef | undefined;
  @ViewChild('scrollAmbitos', { static: false }) scrollAmbitos: ElementRef | undefined;



  solucion: StoreSoluciones | null = null;

  nuevoProblema: StoreProblemas = { titulo: '', description: '' };
  buscadorProblema: string = '';
  problemas: StoreProblemas[] = [];
  allProblemas: StoreProblemas[] = [];
  problemasFiltrados: StoreProblemas[] = [];
  problemaSeleccionado: StoreProblemas | null = null;
  mostrarCrearProblema: boolean = false;
  mostrarModificarProblema: boolean = false;
  mostrarOpcionesProblema: boolean = false;
  mostrarBotonCrearProblema: boolean = true;
  mostrarBotonModificarProblema: boolean = false;
  problemaAEliminar: number | null = null;

  nuevoBeneficio: StoreBeneficios = { titulo: '', description: '' };
  buscadorBeneficio: string = '';
  beneficios: StoreBeneficios[] = [];
  allBeneficios: StoreBeneficios[] = [];
  beneficiosFiltrados: StoreBeneficios[] = [];
  beneficioSeleccionado: StoreBeneficios | null = null;
  mostrarOpciones: boolean = false;
  mostrarCrearBeneficio: boolean = false;
  mostrarModificarBeneficio: boolean = false;
  mostrarBotonCrear: boolean = true;
  mostrarBotonModificarBeneficio: boolean = false;
  beneficioAEliminar: number | null = null;

  nuevaCaracteristica: StoreCaracteristicas = { titulo: '', description: '' };
  buscadorCaracteristica: string = '';
  caracteristicas: StoreCaracteristicas[] = [];
  allCaracteristicas: StoreCaracteristicas[] = [];
  caracteristicasFiltradas: StoreCaracteristicas[] = [];
  caracteristicaSeleccionada: StoreCaracteristicas | null = null;
  mostrarCrearCaracteristica: boolean = false;
  mostrarModificarCaracteristica: boolean = false;
  mostrarOpcionesCaracteristicas: boolean = false;
  mostrarBotonCrearCaracteristica: boolean = true;
  mostrarBotonModificarCaracteristica: boolean = false;
  caracteristicaAEliminar: number | null = null;

  nuevoAmbito: StoreAmbitos = { description: '', textoweb: '', prefijo: '', slug: '' };
  buscadorAmbito: string = '';
  ambitos: StoreCaracteristicas[] = [];
  allAmbitos: StoreCaracteristicas[] = [];
  ambitosFiltrados: StoreCaracteristicas[] = [];
  ambitoSeleccionado: StoreCaracteristicas | null = null;
  mostrarCrearAmbito: boolean = false;
  mostrarModificarAmbito: boolean = false;
  mostrarOpcionesAmbitos: boolean = false;
  mostrarBotonCrearAmbito: boolean = true;
  mostrarBotonModificarAmbito: boolean = false;
  AmbitoAEliminar: number | null = null;


  mostrarModalProblema: boolean = false;
  mostrarModalBeneficio: boolean = false;
  mostrarModalCaracteristica: boolean = false;
  mostrarModalAmbito: boolean = false;

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
      this.mostrarOpcionesCaracteristicas = false;
      this.mostrarModificarAmbito = false;
    }
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const idSolucion = +id;

    this.storeSolucionesService.getStoreSolucionById(idSolucion).subscribe({
      next: (solucion) => {
        this.solucion = {
          ...solucion,
          problemas: solucion.problemas || [],
          beneficios: solucion.beneficios || [],
          caracteristicas: solucion.caracteristicas || [],
          ambitos: solucion.ambitos || []
        };

        forkJoin([
          this.storeSolucionesService.getProblemasBySolucion(idSolucion),
          this.storeSolucionesService.getBeneficiosBySolucion(idSolucion),
          this.storeSolucionesService.getCaracteristicasBySolucion(idSolucion)
          this.storeSolucionesService.getAmbitosBySolucion(idSolucion)
        ]).subscribe({
          next: ([problemas, beneficios, caracteristicas, ambitos]) => {
            this.problemas = this.solucion!.problemas = problemas;
            this.beneficios = this.solucion!.beneficios = beneficios;
            this.caracteristicas = this.solucion!.caracteristicas = caracteristicas;
            this.ambitos = this.solucion!.ambitos = ambitos;
          },
          error: (e) => console.error('Error al obtener problemas, beneficios, características o ámbitos:', e)
        });
      },
      error: (e) => console.error('Error al obtener la solución:', e)
    });

    forkJoin([
      this.storeSolucionesService.getAllProblemas(),
      this.storeSolucionesService.getAllBeneficios(),
      this.storeSolucionesService.getAllCaracteristicas()
      this.storeSolucionesService.getAllAmbitos()
    ]).subscribe({
      next: ([allProblemas, allBeneficios, allCaracteristicas, allAmbitos]) => {
        this.allProblemas = this.problemasFiltrados = allProblemas;
        this.allBeneficios = this.beneficiosFiltrados = allBeneficios;
        this.allCaracteristicas = this.caracteristicasFiltradas = allCaracteristicas;
        this.allAmbitos = this.ambitosFiltrados = allAmbitos;
      },
      error: (e) => console.error('Error al obtener listas globales:', e)
    });
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
    this.nuevoBeneficio = { ...beneficio };
    this.mostrarOpciones = false;

    if (this.scrollBeneficios) {
      this.scrollBeneficios.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

  }

  seleccionarProblema(problema: StoreProblemas) {
    this.buscadorProblema = problema.description;
    this.problemaSeleccionado = problema;
    this.nuevoProblema = { ...problema };
    this.mostrarOpcionesProblema = false;

    if (this.scrollProblemas) {
      this.scrollProblemas.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

  }

  seleccionarCaracteristica(caracteristica: StoreCaracteristicas) {
    this.buscadorCaracteristica = caracteristica.description;
    this.caracteristicaSeleccionada = caracteristica;
    this.nuevaCaracteristica = { ...caracteristica };
    this.mostrarOpcionesCaracteristicas = false;

    if (this.scrollCaracteristicas) {
      this.scrollCaracteristicas.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

  }

  seleccionarAmbito(ambito: StoreAmbitos) {
    this.buscadorAmbito = ambito.description;
    this.ambitoSeleccionado = ambito;
    this.nuevoAmbito = { ...ambito };
    this.mostrarOpcionesAmbitos = false;

    if (this.scrollAmbitos) {
      this.scrollAmbitos.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

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
      this.storeSolucionesService.deleteCaracteristica(this.caracteristicaAEliminar).subscribe({
        next: () => {
          console.log('Característica eliminada correctamente de la base de datos');

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

  filtrarAmbitos() {
    const filtro = this.buscadorAmbito.toLowerCase().trim();
    this.ambitosFiltrados = this.allAmbitos.filter(ambito =>
      ambito.description.toLowerCase().includes(filtro)
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
    this.mostrarCrearCaracteristica = false;
    this.mostrarBotonCrearCaracteristica = true;

    if (!this.nuevaCaracteristica.description || !this.solucion) {
      console.error('Debe ingresar una descripción y la solución debe estar cargada');
      return;
    }

    if (this.solucion) {
      this.solucion.caracteristicasTitle = this.nuevaCaracteristica.titulo || this.solucion.caracteristicasTitle;
      this.solucion.caracteristicasPragma = this.nuevaCaracteristica.description;

      this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
        next: () => {
          console.log('Solución actualizada con los datos de la característica');

          this.storeSolucionesService.createCaracteristica(this.solucion!.id_solucion, this.nuevaCaracteristica).subscribe({
            next: (response) => {
              console.log('Característica creada:', response);

              const caracteristicaCreada: StoreCaracteristicas = {
                id_caracteristica: response.caracteristica.id_caracteristica,
                titulo: this.nuevaCaracteristica.titulo,
                description: this.nuevaCaracteristica.description
              };

              this.allCaracteristicas.push(caracteristicaCreada);
              this.filtrarCaracteristicas();

              if (response.caracteristica.id_caracteristica) {
                this.storeSolucionesService.asociarCaracteristicaASolucion(
                  this.solucion!.id_solucion,
                  response.caracteristica.id_caracteristica
                ).subscribe({
                  next: () => console.log('Característica asociada correctamente'),
                  error: (err) => console.error('Error al asociar la característica:', err)
                });
              }

              this.nuevaCaracteristica = { titulo: '', description: '' };
            },
            error: (error) => {
              console.error('Error al crear la característica:', error);
            }
          });
        },
        error: (err) => {
          console.error('Error al actualizar la solución con los datos de la característica:', err);
        }
      });
    }
  }

  crearNuevoAmbito() {
    this.mostrarCrearAmbito = false;
    this.mostrarBotonCrearAmbito = true;

    if (!this.nuevoAmbito || !this.nuevoAmbito.description) {
      console.error('Debe ingresar la descripción del ámbito');
      return;
    }

    if (!this.nuevoAmbito.slug) {
      console.error('Debe ingresar el slug del ámbito');
      return;
    }

    if (!this.nuevoAmbito.textoweb) {
      console.error('Debe ingresar el texto web del ámbito');
      return;
    }

    if (!this.nuevoAmbito.prefijo) {
      console.error('Debe ingresar el prefijo del ámbito');
      return;
    }

    if (!this.solucion) {
      console.error('La solución debe estar cargada para asociar el ámbito');
      return;
    }

    if (this.solucion) {
      this.solucion.description = this.nuevoAmbito.description || this.solucion.description;
      this.solucion.textoweb = this.nuevoAmbito.textoweb || this.solucion.textoweb;
      this.solucion.prefijo = this.nuevoAmbito.prefijo || this.solucion.prefijo;
      this.solucion.slug = this.nuevoAmbito.slug || this.solucion.slug;

      this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
        next: () => {
          console.log('Solución actualizada con los datos del ámbito');

          this.storeSolucionesService.createAmbito(this.solucion!.id_solucion, this.nuevoAmbito).subscribe({
            next: (response) => {
              console.log('Ámbito creado:', response);

              const ambitoCreado: StoreAmbitos = {
                id_ambito: response.caracteristica.id_caracteristica,
                description: this.nuevoAmbito.description,
                textoweb: this.nuevoAmbito.textoweb,
                prefijo: this.nuevoAmbito.prefijo,
                slug: this.nuevoAmbito.slug
              };

              this.allAmbitos.push(ambitoCreado);
              this.filtrarAmbitos();

              if (response.ambito.id_ambito) {
                this.storeSolucionesService.asociarAmbitoASolucion(
                  this.solucion!.id_solucion,
                  response.ambito.id_ambito
                ).subscribe({
                  next: () => console.log('Ámbito asociado correctamente'),
                  error: (err) => console.error('Error al asociar el ámbito:', err)
                });
              }

              this.nuevoAmbito = { description: '', textoweb: '', prefijo: '', slug: '' };
            },
            error: (error) => {
              console.error('Error al crear el ámbito:', error);
            }
          });
        },
        error: (err) => {
          console.error('Error al actualizar la solución con los datos del ámbito:', err);
        }
      });
    }
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
    this.beneficioAEliminar = null;
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

  confirmarEliminarAmbito(idAmbito: number, event: MouseEvent) {
    event.stopPropagation();
    this.AmbitoAEliminar = idAmbito;
    this.mostrarModalAmbito = true;
  }

  cancelarEliminarAmbito() {
    this.mostrarModalAmbito = false;
    this.AmbitoAEliminar = null;
  }

  modificarProblema() {
    console.log('Modificando problema...', this.nuevoProblema, this.problemaSeleccionado);

    if (!this.nuevoProblema || !this.nuevoProblema.description) {
      console.error('Debe ingresar la descripción del problema');
      return;
    }

    if (this.problemaSeleccionado && this.problemaSeleccionado.id_problema !== undefined) {
      console.log('ID problema a modificar:', this.problemaSeleccionado.id_problema);
      this.storeSolucionesService.modifyProblema(this.problemaSeleccionado.id_problema, this.nuevoProblema)
        .subscribe({
          next: (updatedProblema: StoreProblemas) => {
            console.log('Problema actualizado correctamente:', updatedProblema);
            this.mostrarModificarProblema = false;
            this.mostrarBotonModificarProblema = true;
          },
          error: (error) => {
            console.error('Error al modificar el problema:', error);
          }
        });
    } else {
      console.error('Problema no seleccionado o id_problema inválido');
    }
  }

  modificarCaracteristica() {
    console.log('Modificando característica..', this.nuevaCaracteristica, this.caracteristicaSeleccionada);

    if (!this.nuevaCaracteristica || !this.nuevaCaracteristica.description) {
      console.error('Debe ingresar la descripción de la característica');
      return;
    }

    if (this.caracteristicaSeleccionada && this.caracteristicaSeleccionada.id_caracteristica !== undefined) {
      console.log('ID caracteristica a modificar:', this.caracteristicaSeleccionada.id_caracteristica);
      this.storeSolucionesService.modifyCaracteristica(this.caracteristicaSeleccionada.id_caracteristica, this.nuevaCaracteristica)
        .subscribe({
          next: (updatedCaracteristica: StoreCaracteristicas) => {
            console.log('Característica actualizada correctamente:', updatedCaracteristica);
            this.mostrarModificarCaracteristica = false;
            this.mostrarBotonModificarCaracteristica = true;
          },
          error: (error) => {
            console.error('Error al modificar la característica:', error);
          }
        });
    } else {
      console.error('Característica no seleccionada o id_caracteristica inválido');
    }
  }

  modificarBeneficio() {
    console.log('Modificando beneficio..', this.nuevoBeneficio, this.beneficioSeleccionado);

    if (!this.nuevoBeneficio || !this.nuevoBeneficio.description) {
      console.error('Debe ingresar la descripción del beneficio');
      return;
    }

    if (this.beneficioSeleccionado && this.beneficioSeleccionado.id_beneficio !== undefined) {
      console.log('ID beneficio a modificar:', this.beneficioSeleccionado.id_beneficio);
      this.storeSolucionesService.modifyBeneficio(this.beneficioSeleccionado.id_beneficio, this.nuevoBeneficio)
        .subscribe({
          next: (updatedBeneficio: StoreBeneficios) => {
            console.log('Beneficio actualizado correctamente:', updatedBeneficio);
            this.mostrarModificarBeneficio = false;
            this.mostrarBotonModificarBeneficio = true;
          },
          error: (error) => {
            console.error('Error al modificar el beneficio:', error);
          }
        });
    } else {
      console.error('Beneficio no seleccionado o id_beneficio inválido');
    }
  }

  modificarAmbito() {
    console.log('Modificando ambito..', this.nuevoAmbito, this.ambitoSeleccionado);

    if (!this.nuevoAmbito || !this.nuevoAmbito.description) {
      console.error('Debe ingresar la descripción del ámbito');
      return;
    }

    if (!this.nuevoAmbito.slug) {
      console.error('Debe ingresar el slug del ámbito');
      return;
    }

    if (!this.nuevoAmbito.textoweb) {
      console.error('Debe ingresar el texto web del ámbito');
      return;
    }

    if (!this.nuevoAmbito.prefijo) {
      console.error('Debe ingresar el prefijo del ámbito');
      return;
    }

    if (this.ambitoSeleccionado && this.ambitoSeleccionado.id_ambito !== undefined) {
      console.log('ID ámbito a modificar:', this.ambitoSeleccionado.id_ambito);
      this.storeSolucionesService.modifyAmbito(this.ambitoSeleccionado.id_ambito, this.nuevoAmbito)
        .subscribe({
          next: (updatedAmbito: StoreAmbitos) => {
            console.log('Ámbito actualizado correctamente:', updatedAmbito);
            this.mostrarModificarAmbito = false;
            this.mostrarBotonModificarAmbito = true;
          },
          error: (error) => {
            console.error('Error al modificar el ámbito:', error);
          }
        });
    } else {
      console.error('Ámbito no seleccionado o id_ambito inválido');
    }
  }


}