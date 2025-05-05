import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StoreAmbitos } from '@modelos-shared/storeAmbitos';
import { AmbitosService } from '../services/ambitos.service';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'app-ambitos',
  standalone: true,
  imports: [CommonModule, MenuComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './ambitos.component.html',
  styleUrl: './ambitos.component.sass',
})

export class AmbitosComponent {

  @ViewChild('crearForm') crearFormRef!: ElementRef;
  @ViewChild('editarForm') editarFormRef!: ElementRef;

  storeAmbitos: StoreAmbitos[] = [];
  ambitosFiltrados: StoreAmbitos[] = [];
  filtroDescripcion = new FormControl('');

  mostrarModal: boolean = false;
  ambitoAEliminar: number | null = null;
  ambitoAEditar: StoreAmbitos | null = null;

  mostrarFormularioCrear: boolean = false;
  mostrarFormularioEditar: boolean = false;

  nuevoAmbito: StoreAmbitos = {
    description: '',
    textoweb: '',
    prefijo: '',
    slug: ''
  };


  constructor(private storeAmbitosService: AmbitosService, private router: Router) { }

  ngOnInit() {
    this.cargarAmbitos();

    this.filtroDescripcion.valueChanges
      .pipe(debounceTime(500))
      .subscribe(filtro => this.filtrarAmbitos(filtro || ''));
  }

  cargarAmbitos() {
    this.storeAmbitosService.getStoreAmbitos().subscribe({
      next: (response) => {
        console.log('StoreAmbitos obtenidos: ', response);
        this.storeAmbitos = response;
        this.ambitosFiltrados = response;
      },
      error: (error) => {
        console.error('Error al obtener storeAmbitos: ', error);
      }
    });
  }

  confirmarEliminarAmbito(idAmbito: number, event: MouseEvent) {
    event.stopPropagation();
    this.ambitoAEliminar = idAmbito;
    this.mostrarModal = true;
  }

  cancelarEliminarAmbito() {
    this.mostrarModal = false;
    this.ambitoAEliminar = null;
  }

  eliminarAmbito() {
    if (this.ambitoAEliminar) {
      this.storeAmbitosService.deleteStoreAmbito(this.ambitoAEliminar).subscribe({
        next: () => {
          this.storeAmbitos = this.storeAmbitos.filter(ambito => ambito.id_ambito !== this.ambitoAEliminar);
          this.filtrarAmbitos(this.filtroDescripcion.value || '');
          console.log(`Ámbito con id ${this.ambitoAEliminar} eliminado correctamente`);
          this.mostrarModal = false;
          this.ambitoAEliminar = null;
        },
        error: (error) => {
          console.error('Error al eliminar ámbito: ', error);
          this.mostrarModal = false;
          this.ambitoAEliminar = null;
        }
      });
    }
  }

  trackByAmbitoId(index: number, ambito: StoreAmbitos): number {
    if (ambito.id_ambito === undefined) {
      throw new Error('id_ambito es undefined');
    }
    return ambito.id_ambito;
  }

  filtrarAmbitos(filtro: string) {
    const filtroLimpio = filtro.toLowerCase().trim();

    if (filtroLimpio.length < 3) {
      this.ambitosFiltrados = this.storeAmbitos;
      return;
    }

    this.ambitosFiltrados = this.storeAmbitos.filter(ambito =>
      ambito.description.toLowerCase().includes(filtroLimpio)
    );
  }

  crearAmbito() {
    this.storeAmbitosService.createStoreAmbito(this.nuevoAmbito).subscribe({
      next: (ambitoCreado) => {
        console.log('Ámbito creado:', ambitoCreado);
        this.storeAmbitos.push(ambitoCreado);
        this.filtrarAmbitos(this.filtroDescripcion.value || '');
        this.nuevoAmbito = { description: '', textoweb: '', prefijo: '', slug: '' };
        this.mostrarFormularioCrear = false;
      },
      error: (error) => {
        console.error('Error al crear ámbito:', error);
      }
    });
  }

  scrollCrear() {
    setTimeout(() => {
      this.crearFormRef?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  mostrarFormularioEditarAmbito(ambito: StoreAmbitos) {
    this.ambitoAEditar = { ...ambito };
    this.mostrarFormularioEditar = true;
    this.mostrarFormularioCrear = false;

    setTimeout(() => {
      this.editarFormRef?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

  }

  guardarCambiosAmbito() {
    if (!this.ambitoAEditar?.id_ambito) return;

    this.storeAmbitosService.modifyAmbito(this.ambitoAEditar.id_ambito, this.ambitoAEditar).subscribe({
      next: (ambitoActualizado) => {
        const index = this.storeAmbitos.findIndex(a => a.id_ambito === ambitoActualizado.id_ambito);
        if (index !== -1) {
          this.storeAmbitos[index] = ambitoActualizado;
          this.filtrarAmbitos(this.filtroDescripcion.value || '');
        }
        this.mostrarFormularioEditar = false;
        this.ambitoAEditar = null;
      },
      error: (err) => {
        console.error('Error al modificar el ámbito:', err);
      }
    });
  }

}
