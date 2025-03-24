import { Route } from '@angular/router';
import path from 'path';
import { HomeComponent } from './home/home.component';

export const appRoutes: Route[] = [
    {path: '', component: HomeComponent},
];
