# Shared UI Library

Esta librería contiene componentes de UI reutilizables para todas las aplicaciones del proyecto Helm.

## Componentes disponibles

### Buttons

- `ButtonComponent`: Un componente de botón personalizable con diferentes estilos, tamaños y estados.

#### Uso

```typescript
import { SharedUiModule } from '@helm-workspace/shared-ui';

@NgModule({
  imports: [
    SharedUiModule
  ]
})
export class YourModule {}
```

En la plantilla HTML:

```html
<helm-workspace-button