# Feature Auth Library

Esta librería contiene toda la funcionalidad relacionada con la autenticación de usuarios, incluyendo:

- Login de usuarios
- Registro de usuarios
- Gestión de sesiones
- Protección de rutas

## Estructura

- `src/lib`: Contiene los componentes y servicios principales
- `src/lib/login`: Componentes y servicios para el login
- `src/lib/registro`: Componentes y servicios para el registro
- `src/lib/guards`: Guards para protección de rutas
- `src/lib/models`: Modelos de datos relacionados con la autenticación

## Uso

Importa los módulos necesarios en tu aplicación:

```typescript
import { FeatureAuthModule } from '@helm-workspace/feature-auth';
```