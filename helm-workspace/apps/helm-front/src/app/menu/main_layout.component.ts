import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [MenuComponent, RouterModule],
  template: `
    <app-menu class="menu-lateral"></app-menu>
    <router-outlet></router-outlet>
  `
})
export class MainLayoutComponent {}