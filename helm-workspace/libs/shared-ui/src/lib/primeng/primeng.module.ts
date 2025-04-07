import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Importaciones de PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';


// Lista de módulos de PrimeNG que se exportarán
const primeNgModules = [
    ButtonModule,
    InputTextModule,
    CardModule,
    TableModule,
    DialogModule,
    ToastModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    MenuModule,
    PanelModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    FormsModule,
    ReactiveFormsModule
  ];

@NgModule({
    imports: [
      CommonModule,
      ...primeNgModules
    ],
    exports: [
      ...primeNgModules
    ]
  })
  export class PrimeNgModule { }