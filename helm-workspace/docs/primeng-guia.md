# Guía de Uso de PrimeNG en el Proyecto

## Introducción

Esta guía explica cómo utilizar PrimeNG en el proyecto. PrimeNG es una biblioteca de componentes UI para Angular que ofrece más de 80 componentes ricos en características para crear interfaces de usuario modernas y responsivas.

## Versiones Instaladas

- **Angular**: 18.2.0
- **NX**: 19.6.0
- **PrimeNG**: 18.0.2
- **@primeng/themes**: 19.0.10
- **primeicons**: 7.0.0

## Estructura de la Integración

Hemos integrado PrimeNG en el proyecto de la siguiente manera:

1. **Módulo PrimeNG Compartido**: Creamos un módulo compartido (`PrimeNgModule`) que importa y exporta todos los componentes de PrimeNG que necesitamos usar en la aplicación.

2. **Integración con SharedUiModule**: El módulo `PrimeNgModule` está integrado en el `SharedUiModule`, lo que significa que cualquier componente que importe `SharedUiModule` tendrá acceso a todos los componentes de PrimeNG.

3. **Estilos Globales**: Los estilos de PrimeNG están importados en el archivo `styles.sass` principal.

4. **Componente de Demostración**: Hemos creado un componente de demostración (`PrimengDemoComponent`) que muestra ejemplos de uso de los componentes de PrimeNG.

## Cómo Usar PrimeNG en tu Proyecto

### En Componentes Standalone

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '@helm-workspace/shared-ui';
// O importa directamente desde la ruta relativa
// import { PrimeNgModule } from '../../libs/shared-ui/src/lib/primeng/primeng.module';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule, PrimeNgModule],
  template: `
    <p-card header="Mi Tarjeta">
      <p>Contenido de la tarjeta</p>
      <p-button label="Aceptar"></p-button>
    </p-card>
  `
})
export class MiComponenteComponent {}
```

### En Módulos Tradicionales

Si estás utilizando módulos tradicionales de Angular, simplemente importa `SharedUiModule` en tu módulo:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@helm-workspace/shared-ui';

@NgModule({
  imports: [
    CommonModule,
    SharedUiModule // Esto te da acceso a todos los componentes de PrimeNG
  ],
  declarations: [/* tus componentes */],
})
export class MiModuloModule {}
```

## Componente de Demostración

Hemos incluido un componente de demostración que puedes usar como referencia. Para utilizarlo:

```typescript
import { Component } from '@angular/core';
import { PrimengDemoComponent } from '@helm-workspace/shared-ui';

@Component({
  selector: 'app-mi-pagina',
  standalone: true,
  imports: [PrimengDemoComponent],
  template: `
    <h1>Mi Página</h1>
    <app-primeng-demo></app-primeng-demo>
  `
})
export class MiPaginaComponent {}
```

## Temas de PrimeNG

Actualmente estamos utilizando el tema "Lara Light Blue". Si deseas cambiar el tema, modifica las importaciones en el archivo `styles.sass`:

```sass
/* Cambia esta línea para usar un tema diferente */
@import "primeng/resources/themes/lara-light-blue/theme.css";
```

Otros temas disponibles incluyen:
- lara-light-indigo
- lara-light-purple
- lara-light-teal
- lara-dark-blue
- lara-dark-indigo
- lara-dark-purple
- lara-dark-teal
- md-light-indigo
- md-light-deeppurple
- md-dark-indigo
- md-dark-deeppurple

## Recursos Adicionales

- [Documentación oficial de PrimeNG](https://primeng.org/)
- [Ejemplos de PrimeNG](https://primeng.org/installation)
- [Temas de PrimeNG](https://primeng.org/theming)