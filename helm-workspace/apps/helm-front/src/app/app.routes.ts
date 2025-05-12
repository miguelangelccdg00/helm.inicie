import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { authGuard } from './auth.guard';
import { StoreSolucionesComponent } from './store-soluciones/store-soluciones.component';
import { ModificarSolucionComponent } from './modificar-solucion/modificar-solucion.component';
import { SectoresComponent } from './sectores/sectores.component';
import { AmbitosComponent } from './ambitos/ambitos.component';
import { MainLayoutComponent } from './menu/main_layout.component';
import { TestComponent } from './test-component/test-component.component';

export const appRoutes: Route[] = [
  // Página principal (sin menú)
  { path: '', component: HomeComponent },

  // Rutas protegidas con menú
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'test', component: TestComponent, canActivate: [authGuard] },
      { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
      { path: 'store-soluciones', component: StoreSolucionesComponent },
      { path: 'modificar-solucion/:id', component: ModificarSolucionComponent },
      { path: 'ambitos', component: AmbitosComponent },
      { path: 'sectores', component: SectoresComponent }
    ]
  }
];