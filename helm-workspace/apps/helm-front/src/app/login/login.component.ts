import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class LoginComponent {

  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    contrasena: new FormControl('', Validators.required),
  });

  usuarioPlaceholder: string = "";
  contrasenaPlaceholder: string = "";
  mostrarRecordar: boolean = true;
  mostrarDescubrir: boolean = false;

  constructor() {
    this.updatePlaceholders(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const screenWidth = (event.target as Window).innerWidth;
    this.updatePlaceholders(screenWidth);
  }

  updatePlaceholders(width: number) {
    if (width <= 500) {
      this.usuarioPlaceholder = "Introduce tu nombre de usuario";
      this.contrasenaPlaceholder = "Contraseña";
      this.mostrarRecordar = false;
      this.mostrarDescubrir = true;
    } else {
      this.usuarioPlaceholder = "Introduce tu usuario";
      this.contrasenaPlaceholder = "Introduce tu contraseña";
      this.mostrarRecordar = true;
      this.mostrarDescubrir = false;
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Inicio de sesión exitoso', this.loginForm.value);
    } else {
      console.log('El usuario o la contraseña no son válidos');
    }
  }
  
}
