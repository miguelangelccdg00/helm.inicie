import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { authGuard } from './auth.guard';
import { StoreSolucionesComponent } from './store-soluciones/store-soluciones.component';
import { ModificarSolucionComponent } from './modificar-solucion/modificar-solucion.component';

export const appRoutes: Route[] = [
    {path: '', component: HomeComponent},
    {path: 'menu', component: MenuComponent, canActivate: [authGuard]},
    {path: 'store-soluciones', component: StoreSolucionesComponent},
    {path: 'modificar-solucion/:id', component: ModificarSolucionComponent}
];