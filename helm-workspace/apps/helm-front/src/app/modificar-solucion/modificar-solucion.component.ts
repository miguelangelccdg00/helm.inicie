import { Component, OnInit, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSolucionesService } from '../services/store-soluciones.service';
import { StoreSoluciones } from '@modelos-shared/storeSoluciones';
import { StoreBeneficios } from '@modelos-shared/storeBeneficios';
import { StoreProblemas } from '@modelos-shared/storeProblemas';
import { StoreCaracteristicas } from '@modelos-shared/storeCaracteristicas';
import { StoreAmbitos } from '@modelos-shared/storeAmbitos';
import { SolucionAmbito } from '@modelos-shared/solucionAmbito';
import { StoreSectores } from '@modelos-shared/storeSectores';
import { SolucionSector } from '@modelos-shared/solucionSector';
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
  @ViewChild('formularioSolucionAmbito', { static: false }) formularioSolucionAmbito: ElementRef | undefined;
  @ViewChild('scrollSectores', { static: false }) scrollSectores: ElementRef | undefined;
  @ViewChild('formularioSolucionSector', { static: false }) formularioSolucionSector: ElementRef | undefined;
  
  solucion: StoreSoluciones | null = null;

  solucionesAmbitos: SolucionAmbito[] = [];

  nuevaSolucionAmbito: SolucionAmbito = {
    description: '',
    title: '',
    subtitle: '',
    icon: '',
    titleweb: '',
    slug: '',
    multimediaUri: '',
    multimediaTypeId: '',
    problemaTitle: '',
    problemaPragma: '',
    solucionTitle: '',
    solucionPragma: '',
    caracteristicasTitle: '',
    caracteristicasPragma: '',
    casosdeusoTitle: '',
    casosdeusoPragma: '',
    firstCtaTitle: '',
    firstCtaPragma: '',
    secondCtaTitle: '',
    secondCtaPragma: '',
    beneficiosTitle: '',
    beneficiosPragma: '',

  };

  solucionesSectores: SolucionSector[] = [];

  nuevaSolucionSector: SolucionSector = {
    descalternativa: '',
    textoalternativo: ''
  };
  
  mostrarOpcionesSolucionAmbito: boolean = false;
  solucionAmbitoSeleccionado: SolucionAmbito | null = null;
  solucionAmbitoAEliminar: { idAmbito: number, idSolucion: number } | null = null;
  mostrarModificarSolucionAmbito: boolean = false;
  mostrarBotonModificarSolucionAmbito: boolean = false;

  mostrarOpcionesSolucionSector: boolean = false;
  solucionSectorSeleccionado: SolucionSector | null = null;
  solucionSectorAEliminar: { idSector: number, idSolucion: number } | null = null;
  mostrarModificarSolucionSector: boolean = false;
  mostrarBotonModificarSolucionSector: boolean = false;

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
  ambitos: StoreAmbitos[] = [];
  allAmbitos: StoreAmbitos[] = [];
  ambitosFiltrados: StoreAmbitos[] = [];
  ambitoSeleccionado: StoreAmbitos | null = null;
  mostrarCrearAmbito: boolean = false;
  mostrarModificarAmbito: boolean = false;
  mostrarOpcionesAmbitos: boolean = false;
  mostrarBotonCrearAmbito: boolean = true;
  mostrarBotonModificarAmbito: boolean = false;
  AmbitoAEliminar: number | null = null;

  nuevoSector: StoreSectores = { description: '', textoweb: '', prefijo: '', slug: '', descriptionweb: '', titleweb: '', backgroundImage: '' };    
  buscadorSector: string = '';
  sectores: StoreSectores[] = [];
  allSectores: StoreSectores[] = [];
  sectoresFiltrados: StoreSectores[] = [];
  sectorSeleccionado: StoreSectores | null = null;
  mostrarCrearSector: boolean = false;
  mostrarModificarSector: boolean = false;
  mostrarOpcionesSectores: boolean = false;
  mostrarBotonCrearSector: boolean = true;
  mostrarBotonModificarSector: boolean = false;
  sectorAEliminar: number | null = null;

  mostrarModalProblema: boolean = false;
  mostrarModalBeneficio: boolean = false;
  mostrarModalCaracteristica: boolean = false;
  mostrarModalAmbito: boolean = false;
  mostrarModalSolucionAmbito: boolean = false;
  mostrarModalSector: boolean = false;
  mostrarModalSolucionSector: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeSolucionesService: StoreSolucionesService,
    private changeDetectorRef: ChangeDetectorRef 
) { }

  @HostListener('document:click', ['$event'])
  clickFuera(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest('.emojis') || target.closest('.subseccion')) {
      return;
    }

    if (!target.closest('.buscador-selector-container')) {
      this.mostrarOpcionesProblema = false;
      this.mostrarOpciones = false;
      this.mostrarOpcionesCaracteristicas = false;
      this.mostrarOpcionesAmbitos = false;
      this.mostrarOpcionesSectores = false;
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
          ambitos: solucion.ambitos || [],
          sectores: solucion.sectores || []
        };
  
        forkJoin([
          this.storeSolucionesService.getProblemasBySolucion(idSolucion),
          this.storeSolucionesService.getBeneficiosBySolucion(idSolucion),
          this.storeSolucionesService.getCaracteristicasBySolucion(idSolucion),
          this.storeSolucionesService.getAmbitosBySolucion(idSolucion),
          this.storeSolucionesService.getSectoresBySolucion(idSolucion)
        ]).subscribe({
          next: ([problemas, beneficios, caracteristicas, ambitos, sectores]) => {
            this.problemas = this.solucion!.problemas = problemas;
            this.beneficios = this.solucion!.beneficios = beneficios;
            this.caracteristicas = this.solucion!.caracteristicas = caracteristicas;
            this.ambitos = this.solucion!.ambitos = ambitos;
            this.sectores = this.solucion!.sectores = sectores;
  
            console.log('Ámbitos cargados:', ambitos);
            console.log('Sectores cargados:', sectores);
  
            this.changeDetectorRef.detectChanges();
          },
          error: (e) => console.error('Error al obtener entidades relacionadas:', e)
        });
  
        this.storeSolucionesService.getAmbitosBySolucion(idSolucion).subscribe({
          next: (ambitos) => {
            if (ambitos && ambitos.length > 0) {
              this.ambitos = this.solucion!.ambitos = ambitos;
              console.log('Ámbitos recargados:', ambitos);
              this.changeDetectorRef.detectChanges();
            }
          },
          error: (e) => console.error('Error al recargar ámbitos:', e)
        });
  
        this.storeSolucionesService.listAmbitos(idSolucion).subscribe({
          next: (res) => {
            this.solucionesAmbitos = res;
            this.changeDetectorRef.detectChanges();
          },
          error: (err) => console.error('Error al obtener soluciones por ámbito:', err)
        });

        this.storeSolucionesService.getSectoresBySolucion(idSolucion).subscribe({
          next: (sectores) => {
            if (sectores && sectores.length > 0) {
              this.sectores = this.solucion!.sectores = sectores;
              console.log('Sectores recargados:', sectores);
              this.changeDetectorRef.detectChanges();
            }
          },
          error: (e) => console.error('Error al recargar ámbitos:', e)
        });
  
        this.storeSolucionesService.listSectores(idSolucion).subscribe({
          next: (res) => {
            this.solucionesSectores = res;
            this.changeDetectorRef.detectChanges();
          },
          error: (err) => console.error('Error al obtener soluciones por sector:', err)
        });

      },
      error: (e) => console.error('Error al obtener la solución:', e)
    });
  
    forkJoin([
      this.storeSolucionesService.getAllProblemas(),
      this.storeSolucionesService.getAllBeneficios(),
      this.storeSolucionesService.getAllCaracteristicas(),
      this.storeSolucionesService.getAllAmbitos(),
      this.storeSolucionesService.getAllSectores()
    ]).subscribe({
      next: ([allProblemas, allBeneficios, allCaracteristicas, allAmbitos, allSectores]) => {
        this.allProblemas = allProblemas;
        this.allBeneficios = allBeneficios;
        this.allCaracteristicas = allCaracteristicas;
        this.allAmbitos = allAmbitos;
        this.allSectores = allSectores;
      },
      error: (e) => console.error('Error al cargar todos los elementos:', e)
    });
  }
  

  guardarCambios() {
    if (this.solucion) {
      if (this.problemas.length > 0 && this.problemas[0].description) {
        this.solucion.problemaPragma = this.problemas[0].description;
      }

      if (this.caracteristicas.length > 0 && this.caracteristicas[0].description) {
        this.solucion.caracteristicasPragma = this.caracteristicas[0].description;
      }
      
      if (this.beneficios.length > 0 && this.beneficios[0].description) {
        this.solucion.beneficiosPragma = this.beneficios[0].description;
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
        error: (error) => console.error('Error al actualizar la solución:', error)
      });
    } else {
      console.error('La solución no está definida');
    }
  }

  cancelar() {
    this.router.navigate(['/store-soluciones']);
  }

  scrollProblema() {
    if (this.scrollProblemas) {
      this.scrollProblemas.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollBeneficio() {
    if (this.scrollBeneficios) {
      this.scrollBeneficios.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollCaracteristica() {
    if (this.scrollCaracteristicas) {
      this.scrollCaracteristicas.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollAmbito() {
    if (this.scrollAmbitos) {
      this.scrollAmbitos.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollSector() {
    if (this.scrollSectores) {
      this.scrollSectores.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
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
  }

  seleccionarSolucionAmbito(solucionAmbito: SolucionAmbito) {
    this.solucionAmbitoSeleccionado = solucionAmbito;
    this.mostrarOpcionesSolucionAmbito = false;
  }

  seleccionarSector(sector: StoreSectores) {
    this.buscadorSector = sector.description;
    this.sectorSeleccionado = sector;
    this.nuevoSector = { ...sector };
    this.mostrarOpcionesSectores = false;
  }

  seleccionarSolucionSector(solucionSector: SolucionSector) {
    this.solucionSectorSeleccionado = solucionSector;
    this.mostrarOpcionesSolucionSector = false;
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
            error: (error) => {
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
    if (!this.buscadorProblema || !this.solucion) {
      return console.error('Debe seleccionar un problema antes de agregarlo');
    }
  
    const problema = this.problemaSeleccionado || this.allProblemas.find(
      p => p.description.toLowerCase() === this.buscadorProblema.toLowerCase()
    );
  
    if (!problema) return console.error('Problema no encontrado');
  
    const yaExiste = this.problemas.some(p => p.id_problema === problema.id_problema);
    if (yaExiste) return console.error('Este problema ya está agregado');
  
    this.solucion.problemaTitle = problema.titulo || '';
    this.solucion.problemaPragma = problema.description;
    this.problemas.push(problema);
    this.solucion.problemas = this.problemas;
  
    this.storeSolucionesService.updateStoreSolucion(this.solucion.id_solucion, this.solucion).subscribe({
      next: () => {
        console.log('Problema agregado correctamente a la solución');
        if (!problema.id_problema) return;
  
        this.storeSolucionesService.asociarProblemaASolucion(this.solucion!.id_solucion, problema.id_problema).subscribe({
          next: () => {
            console.log('Problema asociado correctamente');
            this.storeSolucionesService.getStoreSolucionById(this.solucion!.id_solucion).subscribe({
              next: solucionActualizada => {
                console.log('Solución después de asociar problema:', solucionActualizada);
              }
            });
          },
          error: err => console.error('Error al asociar problema:', err)
        });
      },
      error: err => console.error('Error al agregar problema:', err)
    });
  
    this.buscadorProblema = '';
    this.problemaSeleccionado = null;
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
            error: (error) => {
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

  agregarAmbito() {
    if (this.buscadorAmbito && this.solucion) {
      const ambitoSeleccionado = this.ambitoSeleccionado ||
        this.allAmbitos.find(
          a => a.description.toLowerCase() === this.buscadorAmbito.toLowerCase()
        );
  
      if (ambitoSeleccionado) {
        const yaExiste = this.ambitos.some(
          a => a.id_ambito === ambitoSeleccionado.id_ambito
        );
  
        if (!yaExiste) {
          this.storeSolucionesService.asociarAmbitoASolucion(this.solucion.id_solucion, ambitoSeleccionado.id_ambito!).subscribe({
            next: () => {
              console.log('Ámbito asociado correctamente a la solución');
  
              this.ambitos.push(ambitoSeleccionado);
              this.solucion!.ambitos = this.ambitos;
  
              const nuevaSolucionAmbito: SolucionAmbito = {
                id_solucion: this.solucion!.id_solucion,
                id_ambito: ambitoSeleccionado.id_ambito!,
                description: ambitoSeleccionado.description,
                slug: ambitoSeleccionado.slug,
                title: '',
                subtitle: '',
                icon: '',
                titleweb: '',
                multimediaUri: '',
                multimediaTypeId: '',
                problemaTitle: '',
                problemaPragma: '',
                solucionTitle: '',
                solucionPragma: '',
                caracteristicasTitle: '',
                caracteristicasPragma: '',
                casosdeusoTitle: '',
                casosdeusoPragma: '',
                firstCtaTitle: '',
                firstCtaPragma: '',
                secondCtaTitle: '',
                secondCtaPragma: '',
                beneficiosTitle: '',
                beneficiosPragma: ''
              };
  
              this.solucionesAmbitos.push(nuevaSolucionAmbito);
  
              this.buscadorAmbito = '';
              this.ambitoSeleccionado = null;
            },
            error: (error) => {
              console.error('Error al asociar el ámbito a la solución:', error);
            }
          });
        } else {
          console.error('Este ámbito ya está agregado');
        }
      } else {
        console.error('Ámbito no encontrado');
      }
    } else {
      console.error('Debe seleccionar un ámbito antes de agregarlo');
    }
  }

  /* agregarSector() {
    if (this.buscadorSector && this.solucion) {
      const sectorSeleccionado = this.sectorSeleccionado ||
        this.allSectores.find(
          s => s.description.toLowerCase() === this.buscadorSector.toLowerCase()
        );
  
      if (sectorSeleccionado) {
        const yaExiste = this.sectores.some(
          s => s.id_sector === sectorSeleccionado.id_sector
        );
  
        if (!yaExiste) {
          this.storeSolucionesService.asociarSectorASolucion(this.solucion.id_solucion, sectorSeleccionado.id_sector!).subscribe({
            next: () => {
              console.log('Sector asociado correctamente a la solución');
  
              this.sectores.push(sectorSeleccionado);
              this.solucion!.sectores = this.sectores;
  
              const nuevaSolucionSector: SolucionSector = {
                id_solucion: this.solucion!.id_solucion,
                id_sector: sectorSeleccionado.id_sector!,
                descalternativa: '',
                textoalternativo: '',
              };
  
              this.solucionesSectores.push(nuevaSolucionSector);
  
              this.buscadorSector = '';
              this.sectorSeleccionado = null;
            },
            error: (error) => {
              console.error('Error al asociar el sector a la solución:', error);
            }
          });
        } else {
          console.error('Este sector ya está agregado');
        }
      } else {
        console.error('Sector no encontrado');
      }
    } else {
      console.error('Debe seleccionar un sector antes de agregarlo');
    }
  } */
  
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

  eliminarAmbito() {
    if (this.AmbitoAEliminar === null) return;
  
    this.storeSolucionesService.deleteAmbito(this.AmbitoAEliminar).subscribe({
      next: () => {
        console.log('Ámbito eliminado correctamente de la base de datos');
  
        this.allAmbitos = this.allAmbitos.filter(ambito =>
          ambito.id_ambito !== this.AmbitoAEliminar
        );
        this.ambitos = this.ambitos.filter(ambito =>
          ambito.id_ambito !== this.AmbitoAEliminar
        );
        this.ambitosFiltrados = this.ambitosFiltrados.filter(ambito =>
          ambito.id_ambito !== this.AmbitoAEliminar
        );
  
        if (this.solucion && this.solucion.ambitos) {
          this.solucion.ambitos = this.solucion.ambitos.filter(ambito =>
            ambito.id_ambito !== this.AmbitoAEliminar
          );
        }
  
        this.solucionesAmbitos = this.solucionesAmbitos.filter(ambito =>
          ambito.id_ambito !== this.AmbitoAEliminar
        );
  
        this.AmbitoAEliminar = null;
        this.mostrarModalAmbito = false;
      },
      error: (error) => {
        console.error('Error al eliminar el ámbito:', error);
        this.mostrarModalAmbito = false;
      }
    });
  }

  eliminarSolucionAmbito() {
    if (this.solucionAmbitoAEliminar === null) return;

    const { idAmbito, idSolucion } = this.solucionAmbitoAEliminar;

    this.storeSolucionesService.deleteSolucionAmbito(idSolucion, idAmbito).subscribe({
      next: () => {
        console.log('Solución del ámbito eliminada correctamente de la base de datos');

        this.solucionesAmbitos = this.solucionesAmbitos.filter((ambito) => 
          ambito.id_ambito !== idAmbito || ambito.id_solucion !== idSolucion
        );

        this.solucionAmbitoAEliminar = null;
        this.mostrarModalSolucionAmbito = false;
      },
      error: (error) => {
        console.error('Error al eliminar la solución del ámbito:', error);
        this.mostrarModalSolucionAmbito = false;
      }
    });

  }

  eliminarSector() {
    if (this.sectorAEliminar === null) return;
  
    this.storeSolucionesService.deleteSector(this.sectorAEliminar).subscribe({
      next: () => {
        console.log('Sector eliminado correctamente de la base de datos');
  
        this.allSectores = this.allSectores.filter(sector =>
          sector.id_sector !== this.sectorAEliminar
        );
        this.sectores = this.sectores.filter(sector =>
          sector.id_sector !== this.sectorAEliminar
        );
        this.sectoresFiltrados = this.sectoresFiltrados.filter(sector =>
          sector.id_sector !== this.sectorAEliminar
        );
  
        if (this.solucion && this.solucion.sectores) {
          this.solucion.sectores = this.solucion.sectores.filter(sector =>
            sector.id_sector !== this.sectorAEliminar
          );
        }
  
        this.solucionesSectores = this.solucionesSectores.filter(sector =>
          sector.id_sector !== this.sectorAEliminar
        );
  
        this.sectorAEliminar = null;
        this.mostrarModalSector = false;
      },
      error: (error) => {
        console.error('Error al eliminar el sector:', error);
        this.mostrarModalSector = false;
      }
    });
  }

  eliminarSolucionSector() {
    if (this.solucionSectorAEliminar === null) return;

    const { idSector, idSolucion } = this.solucionSectorAEliminar;

    this.storeSolucionesService.deleteSolucionAmbito(idSolucion, idSector).subscribe({
      next: () => {
        console.log('Solución del sector eliminada correctamente de la base de datos');

        this.solucionesSectores = this.solucionesSectores.filter((sector) => 
          sector.id_sector !== idSector || sector.id_solucion !== idSolucion
        );

        this.solucionSectorAEliminar = null;
        this.mostrarModalSolucionSector = false;
      },
      error: (error) => {
        console.error('Error al eliminar la solución del sector:', error);
        this.mostrarModalSolucionSector = false;
      }
    });

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

  filtrarSectores() {
    const filtro = this.buscadorSector.toLowerCase().trim();
    this.sectoresFiltrados = this.allSectores.filter(sector =>
      sector.description.toLowerCase().includes(filtro)
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
      console.error('La solución debe estar cargada');
      return;
    }
  
    this.storeSolucionesService.createAmbito(this.solucion.id_solucion, this.nuevoAmbito).subscribe({
      next: (ambitoCreadoResponse) => {
        console.log('Ámbito creado:', ambitoCreadoResponse);
  
        const ambitoCreado: StoreAmbitos = {
          id_ambito: ambitoCreadoResponse.ambito.id_ambito,
          description: this.nuevoAmbito.description,
          textoweb: this.nuevoAmbito.textoweb,
          prefijo: this.nuevoAmbito.prefijo,
          slug: this.nuevoAmbito.slug
        };
  
        this.allAmbitos.push(ambitoCreado);
        this.filtrarAmbitos();
        
        this.nuevoAmbito = { description: '', textoweb: '', prefijo: '', slug: '' };
        
        console.log('Ámbito creado y añadido al listado. Ahora puede seleccionarlo para asociarlo a la solución.');
      },
      error: (error) => {
        console.error('Error al crear el ámbito:', error);
      }
    });
  }

  crearNuevoSector() {
    this.mostrarCrearSector = false;
    this.mostrarBotonCrearSector = true;
  
    if (!this.nuevoSector || !this.nuevoSector.description) {
      console.error('Debe ingresar la descripción del sector');
      return;
    }
  
    if (!this.nuevoSector.textoweb) {
      console.error('Debe ingresar el texto web del sector');
      return;
    }
  
    if (!this.nuevoSector.prefijo) {
      console.error('Debe ingresar el prefijo del sector');
      return;
    }

    if (!this.nuevoSector.slug) {
      console.error('Debe ingresar el slug del sector');
      return;
    }

    if (!this.nuevoSector.descriptionweb) {
      console.error('Debe ingresar la descripción web del sector');
      return;
    }

    if (!this.nuevoSector.titleweb) {
      console.error('Debe ingresar el título web del sector');
      return;
    }

    if (!this.nuevoSector.backgroundImage) {
      console.error('Debe ingresar la background image del sector');
      return;
    }
  

    if (!this.solucion) {
      console.error('La solución debe estar cargada');
      return;
    }
  
    this.storeSolucionesService.createSector(this.solucion.id_solucion, this.nuevoSector).subscribe({
      next: (sectorCreadoResponse) => {
        console.log('Sector creado:', sectorCreadoResponse);
  
        const sectorCreado: StoreSectores = {
          id_sector: sectorCreadoResponse.sector.id_sector,
          description: this.nuevoSector.description,
          textoweb: this.nuevoSector.textoweb,
          prefijo: this.nuevoSector.prefijo,
          slug: this.nuevoSector.slug,
          descriptionweb: this.nuevoSector.descriptionweb,
          titleweb: this.nuevoSector.titleweb,
          backgroundImage: this.nuevoSector.backgroundImage
        };
  
        this.allSectores.push(sectorCreado);
        this.filtrarSectores();
        
        this.nuevoSector = { description: '', textoweb: '', prefijo: '', slug: '', descriptionweb: '', titleweb: '', backgroundImage: '' };
        
        console.log('Sector creado y añadido al listado. Ahora puede seleccionarlo para asociarlo a la solución.');
      },
      error: (error) => {
        console.error('Error al crear el sector:', error);
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

  confirmarEliminarSolucionAmbito(idAmbito: number, idSolucion: number, event: MouseEvent) {
    event.stopPropagation();
    this.solucionAmbitoAEliminar = { idAmbito, idSolucion};
    this.mostrarModalSolucionAmbito = true;
  }

  cancelarEliminarSolucionAmbito() {
    this.mostrarModalSolucionAmbito = false;
    this.solucionAmbitoAEliminar = null;
  }

  confirmarEliminarSector(idSector: number, event: MouseEvent) {
    event.stopPropagation();
    this.sectorAEliminar = idSector;
    this.mostrarModalAmbito = true;
  }

  cancelarEliminarSector() {
    this.mostrarModalSector = false;
    this.sectorAEliminar = null;
  }

  confirmarEliminarSolucionSector(idSector: number, idSolucion: number, event: MouseEvent) {
    event.stopPropagation();
    this.solucionSectorAEliminar = { idSector, idSolucion};
    this.mostrarModalSolucionSector = true;
  }

  cancelarEliminarSolucionSector() {
    this.mostrarModalSolucionSector = false;
    this.solucionSectorAEliminar = null;
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
    if (this.ambitoSeleccionado) {
      this.storeSolucionesService.modifyAmbito(this.solucion!.id_solucion, this.ambitoSeleccionado.id_ambito!, this.nuevoAmbito).subscribe({
        next: (updatedAmbito) => {
          console.log('Ámbito modificado correctamente:', updatedAmbito);

          const index = this.solucion!.ambitos.findIndex(a => a.id_ambito === updatedAmbito.id_ambito);
          if (index !== -1) {
            this.solucion!.ambitos[index] = updatedAmbito;
          }

          this.mostrarModificarAmbito = false;
          this.mostrarBotonModificarAmbito = true;
        },
        error: (error) => {
          console.error('Error al modificar el ámbito:', error);
        }
      });
    }
  }

  editarAmbito(ambito: StoreAmbitos, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.ambitoSeleccionado = ambito;
    this.nuevoAmbito = {
      description: ambito.description,
      textoweb: ambito.textoweb,
      prefijo: ambito.prefijo,
      slug: ambito.slug,
      id_ambito: ambito.id_ambito
    };

    this.mostrarModificarAmbito = true;
    this.mostrarBotonCrearAmbito = false;
    this.mostrarBotonModificarAmbito = true;
    this.mostrarOpcionesAmbitos = false;

    if (this.scrollAmbitos) {
      this.scrollAmbitos.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  modificarSector() {
    if (this.sectorSeleccionado) {
      this.storeSolucionesService.modifySector(this.solucion!.id_solucion, this.sectorSeleccionado.id_sector!, this.nuevoSector).subscribe({
        next: (updatedSector) => {
          console.log('Sector modificado correctamente:', updatedSector);

          const index = this.solucion!.sectores.findIndex(a => a.id_sector === updatedSector.id_sector);
          if (index !== -1) {
            this.solucion!.sectores[index] = updatedSector;
          }

          this.mostrarModificarSector = false;
          this.mostrarBotonModificarSector = true;
        },
        error: (error) => {
          console.error('Error al modificar el sector:', error);
        }
      });
    }
  }

  editarSector(sector: StoreSectores, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.sectorSeleccionado = sector;
    this.nuevoSector = {
      description: sector.description,
      textoweb: sector.textoweb,
      prefijo: sector.prefijo,
      slug: sector.slug,
      descriptionweb: sector.descriptionweb,
      titleweb: sector.titleweb,
      backgroundImage: sector.backgroundImage
    };

    this.mostrarModificarSector = true;
    this.mostrarBotonCrearSector = false;
    this.mostrarBotonModificarSector = true;
    this.mostrarOpcionesSectores = false;

    if (this.scrollSectores) {
      this.scrollSectores.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  modificarSolucionAmbito() {
    if (!this.solucion || !this.solucionAmbitoSeleccionado) {
      console.error('No hay solución o solución por ámbito seleccionada');
      return;
    }

    const idSolucion = this.solucion.id_solucion;
    const idAmbito = this.solucionAmbitoSeleccionado.id_ambito;

    if (!idSolucion || !idAmbito) {
      console.error('ID de solución o ID de ámbito no disponibles');
      return;
    }

    const solucionAmbitoActualizada: SolucionAmbito = {
      ...this.nuevaSolucionAmbito,
      id_solucion: idSolucion,
      id_ambito: idAmbito
    };

    this.storeSolucionesService.updateSolucionAmbitos(idSolucion, [solucionAmbitoActualizada]).subscribe({
      next: (response) => {
        console.log('Solución por ámbito actualizada correctamente:', response);
        
        const index = this.solucionesAmbitos.findIndex(
          sa => sa.id_solucion === idSolucion && sa.id_ambito === idAmbito
        );
        
        if (index !== -1) {
          this.solucionesAmbitos[index] = {
            ...this.solucionesAmbitos[index],
            ...this.nuevaSolucionAmbito
          };
        }
        
        this.mostrarModificarSolucionAmbito = false;
        this.solucionAmbitoSeleccionado = null;
      },
      error: (error) => {
        console.error('Error al actualizar la solución por ámbito:', error);
      }
    });
  }

  editarSolucionAmbito(solucionAmbito: SolucionAmbito, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.solucionAmbitoSeleccionado = solucionAmbito;
    this.nuevaSolucionAmbito = {
      description: solucionAmbito.description,
      title: solucionAmbito.title,
      subtitle: solucionAmbito.subtitle,
      icon: solucionAmbito.icon,
      titleweb: solucionAmbito.titleweb,
      slug: solucionAmbito.slug,
      multimediaUri: solucionAmbito.multimediaUri,
      multimediaTypeId: solucionAmbito.multimediaTypeId,
      problemaTitle: solucionAmbito.problemaTitle,
      problemaPragma: solucionAmbito.problemaPragma,
      solucionTitle: solucionAmbito.solucionTitle,
      solucionPragma: solucionAmbito.solucionPragma,
      caracteristicasTitle: solucionAmbito.caracteristicasTitle,
      caracteristicasPragma: solucionAmbito.caracteristicasPragma,
      casosdeusoTitle: solucionAmbito.casosdeusoTitle,
      casosdeusoPragma: solucionAmbito.casosdeusoPragma,
      firstCtaTitle: solucionAmbito.firstCtaTitle,
      firstCtaPragma: solucionAmbito.firstCtaPragma,
      secondCtaTitle: solucionAmbito.secondCtaTitle,
      secondCtaPragma: solucionAmbito.secondCtaPragma,
      beneficiosTitle: solucionAmbito.beneficiosTitle,
      beneficiosPragma: solucionAmbito.beneficiosPragma,
    };

    this.mostrarModificarSolucionAmbito = true;
    this.mostrarBotonModificarSolucionAmbito = true;
    this.mostrarOpcionesSolucionAmbito = false;

    if (this.scrollAmbitos) {
      this.scrollAmbitos.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      if (this.formularioSolucionAmbito) {
        this.formularioSolucionAmbito.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  modificarSolucionSector() {
    if (!this.solucion || !this.solucionAmbitoSeleccionado) {
      console.error('No hay solución o solución por sector seleccionada');
      return;
    }

    const idSolucion = this.solucion.id_solucion;
    const idSector = this.solucionAmbitoSeleccionado.id_ambito;

    if (!idSolucion || !idSector) {
      console.error('ID de solución o ID de sector no disponibles');
      return;
    }

    const solucionSectorActualizada: SolucionSector = {
      ...this.nuevaSolucionSector,
      id_solucion: idSolucion,
      id_sector: idSector
    };

    this.storeSolucionesService.updateSolucionSectores(idSolucion, [solucionSectorActualizada]).subscribe({
      next: (response) => {
        console.log('Solución por sector actualizada correctamente:', response);
        
        const index = this.solucionesSectores.findIndex(
          ss => ss.id_solucion === idSolucion && ss.id_sector === idSector
        );
        
        if (index !== -1) {
          this.solucionesSectores[index] = {
            ...this.solucionesSectores[index],
            ...this.nuevaSolucionSector
          };
        }
        
        this.mostrarModificarSolucionSector = false;
        this.solucionSectorSeleccionado = null;
      },
      error: (error) => {
        console.error('Error al actualizar la solución por sector:', error);
      }
    });
  }

  editarSolucionSector(solucionSector: SolucionSector, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.solucionSectorSeleccionado = solucionSector;
    this.nuevaSolucionSector = {
      descalternativa: solucionSector.descalternativa,
      textoalternativo: solucionSector.textoalternativo,
    };

    this.mostrarModificarSolucionSector = true;
    this.mostrarBotonModificarSolucionSector = true;
    this.mostrarOpcionesSolucionSector = false;

    if (this.scrollSectores) {
      this.scrollSectores.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      if (this.formularioSolucionSector) {
        this.formularioSolucionSector.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}