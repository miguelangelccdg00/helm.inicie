import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { authGuard } from './auth.guard';

export const appRoutes: Route[] = [
    {path: '', component: HomeComponent},
    {path: 'menu', component: MenuComponent, canActivate: [authGuard]}
];