import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importaciones de PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-primeng-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule
  ],
  template: `
    <div class="tarjeta">
      <h2>Demostración de PrimeNG</h2>
      <p>Este componente muestra ejemplos de los componentes de PrimeNG integrados en el proyecto.</p>
      
      <div class="cuadricula">
        <div class="columna-12 md:columna-6">
          <p-card header="Botones" [style]="{ width: '100%' }">
            <div class="flexible envolver espacio-2">
              <p-button label="Primario" styleClass="p-button-primary"></p-button>
              <p-button label="Secundario" styleClass="p-button-secondary"></p-button>
              <p-button label="Éxito" styleClass="p-button-success"></p-button>
              <p-button label="Información" styleClass="p-button-info"></p-button>
              <p-button label="Advertencia" styleClass="p-button-warning"></p-button>
              <p-button label="Peligro" styleClass="p-button-danger"></p-button>
            </div>
          </p-card>
        </div>
        
        <div class="columna-12 md:columna-6">
          <p-card header="Campos de entrada" [style]="{ width: '100%' }">
            <div class="flexible columna espacio-2">
              <span class="p-float-label">
                <input id="entrada-flotante" type="text" pInputText [(ngModel)]="nombreInput"> 
                <label for="entrada-flotante">Nombre</label>
              </span>
              
              <span class="p-float-label margen-superior-4">
                <p-dropdown 
                  [options]="opcionesDropdown" 
                  [(ngModel)]="opcionSeleccionada"
                  optionLabel="nombre" 
                  [showClear]="true" 
                  inputId="desplegable">
                </p-dropdown>
                <label for="desplegable">Selecciona una opción</label>
              </span>
              
              <div class="campo-checkbox margen-superior-4">
                <p-checkbox 
                  name="grupo1" 
                  [(ngModel)]="opcionMarcada" 
                  [value]="true" 
                  inputId="opcion1">
                </p-checkbox>
                <label for="opcion1">Opción de verificación</label>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem;
    }
    
    .tarjeta {
      background: #ffffff;
      padding: 2rem;
      border-radius: 10px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    }
    
    h2 {
      margin-top: 0;
      color: #495057;
    }
    
    .cuadricula {
      display: flex;
      flex-wrap: wrap;
      margin-right: -0.5rem;
      margin-left: -0.5rem;
      margin-top: -0.5rem;
    }
    
    .columna-12 {
      flex: 0 0 100%;
      padding: 0.5rem;
    }
    
    @media (min-width: 768px) {
      .md\\:columna-6 {
        flex: 0 0 50%;
      }
    }
    
    .flexible {
      display: flex;
    }
    
    .envolver {
      flex-wrap: wrap;
    }
    
    .columna {
      flex-direction: column;
    }
    
    .espacio-2 {
      gap: 0.5rem;
    }
    
    .margen-superior-4 {
      margin-top: 1rem;
    }
  `]
})
export class PrimengDemoComponent {
  // Propiedades para los controles de formulario
  nombreInput: string = '';
  opcionSeleccionada: any;
  opcionMarcada: boolean = false;

  // Opciones para el dropdown
  opcionesDropdown = [
    { nombre: 'Opción 1', codigo: 'OP1' },
    { nombre: 'Opción 2', codigo: 'OP2' }
  ];

  constructor() {}
}