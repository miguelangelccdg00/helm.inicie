import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginService } from './login/login.service';
import { RegistroService } from './registro/registro.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegistroComponent
  ],
  exports: [
    LoginComponent,
    RegistroComponent
  ],
  providers: [
    LoginService,
    RegistroService,
    AuthGuard
  ]
})
export class FeatureAuthModule {}