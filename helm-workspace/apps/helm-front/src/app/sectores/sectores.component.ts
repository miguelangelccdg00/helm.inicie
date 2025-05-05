import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSectores } from '@modelos-shared/storeSectores';
import { SectoresService } from '../services/sectores.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-sectores',
  standalone: true,
  imports: [CommonModule, MenuComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './sectores.component.html',
  styleUrl: './sectores.component.sass',
})
export class SectoresComponent {

  @ViewChild('crearForm') crearFormRef!: ElementRef;
  @ViewChild('editarForm') editarFormRef!: ElementRef;

  storeSectores: StoreSectores[] = [];
  sectoresFiltrados: StoreSectores[] = [];
  filtroDescripcion = new FormControl('');

  mostrarModal: boolean = false;
  sectorAEliminar: number | null = null;
  sectorAEditar: StoreSectores | null = null;

  mostrarFormularioCrear: boolean = false;
  mostrarFormularioEditar: boolean = false;

  nuevoSector: StoreSectores = {
    description: '',
    textoweb: '',
    prefijo: '',
    slug: '',
    descriptionweb: '',
    titleweb: '',
    backgroundImage: '',
  };

  constructor(private storeSectoresService: SectoresService, private router: Router) {}

  ngOnInit() {
    this.cargarSectores();

    this.filtroDescripcion.valueChanges
      .pipe(debounceTime(500))
      .subscribe(filtro => this.filtrarSectores(filtro || ''));
  }

  cargarSectores() {
    this.storeSectoresService.getStoreSectores().subscribe({
      next: (response) => {
        console.log('StoreSectores obtenidos: ', response);
        this.storeSectores = response;
        this.sectoresFiltrados = response;
      },
      error: (error) => {
        console.error('Error al obtener storeSectores: ', error);
      }
    });
  }

  confirmarEliminarSector(idSector: number, event: MouseEvent) {
    event.stopPropagation();
    this.sectorAEliminar = idSector;
    this.mostrarModal = true;
  }

  cancelarEliminarSector() {
    this.mostrarModal = false;
    this.sectorAEliminar = null;
  }

  eliminarSector() {
    if (this.sectorAEliminar) {
      this.storeSectoresService.deleteStoreSector(this.sectorAEliminar).subscribe({
        next: () => {
          this.storeSectores = this.storeSectores.filter(sector => sector.id_sector !== this.sectorAEliminar);
          this.filtrarSectores(this.filtroDescripcion.value || '');
          console.log(`Sector con id ${this.sectorAEliminar} eliminado correctamente`);
          this.mostrarModal = false;
          this.sectorAEliminar = null;
        },
        error: (error) => {
          console.error('Error al eliminar sector: ', error);
          this.mostrarModal = false;
          this.sectorAEliminar = null;
        }
      });
    }
  }

  trackBySectorId(index: number, sector: StoreSectores): number {
    if (sector.id_sector === undefined) {
      throw new Error('id_sector es undefined');
    }
    return sector.id_sector;
  }

  filtrarSectores(filtro: string) {
    const filtroLimpio = filtro.toLowerCase().trim();

    if (filtroLimpio.length < 3) {
      this.sectoresFiltrados = this.storeSectores;
      return;
    }

    this.sectoresFiltrados = this.storeSectores.filter(sector =>
      sector.description.toLowerCase().includes(filtroLimpio)
    );
  }

  crearSector() {

    this.mostrarFormularioEditar = false;

    this.storeSectoresService.createStoreSector(this.nuevoSector).subscribe({
      next: (sectorCreado) => {
        console.log('Sector creado:', sectorCreado);
        this.storeSectores.push(sectorCreado);
        this.filtrarSectores(this.filtroDescripcion.value || '');
        this.nuevoSector = { description: '', textoweb: '', prefijo: '', slug: '', descriptionweb: '', titleweb: '', backgroundImage: '' };
        this.mostrarFormularioCrear = false;
      },
      error: (error) => {
        console.error('Error al crear sector:', error);
      }
    });
  }

  scrollCrear() {
    setTimeout(() => {
      this.crearFormRef?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  mostrarFormularioEditarSector(sector: StoreSectores) {
    this.sectorAEditar = { ...sector };
    this.mostrarFormularioEditar = true;
    this.mostrarFormularioCrear = false;

    setTimeout(() => {
      this.editarFormRef?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
  }
  
  guardarCambiosSector() {
    if (!this.sectorAEditar?.id_sector) return;
  
    this.storeSectoresService.modifySector(this.sectorAEditar.id_sector, this.sectorAEditar).subscribe({
      next: (sectorActualizado) => {
        const index = this.storeSectores.findIndex(s => s.id_sector === sectorActualizado.id_sector);
        if (index !== -1) {
          this.storeSectores[index] = sectorActualizado;
          this.filtrarSectores(this.filtroDescripcion.value || '');
        }
        this.mostrarFormularioEditar = false;
        this.sectorAEditar = null;
      },
      error: (err) => {
        console.error('Error al modificar el sector:', err);
      }
    });
  }
  
}