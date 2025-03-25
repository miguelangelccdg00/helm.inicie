import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
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

  constructor(private loginService: LoginService) {
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
    console.log('Formulario enviado', this.loginForm.value);
    
    if (this.loginForm.valid) {
      const { usuario, contrasena } = this.loginForm.value;

      const usuarioFinal = usuario ?? '';
      const contrasenaFinal = contrasena ?? '';
      
      console.log('Enviando datos al servidor:', { nombreUsuario: usuarioFinal, contraseña: contrasenaFinal });
  
      this.loginService.login(usuarioFinal, contrasenaFinal).subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso', response);
          alert('Inicio de sesión exitoso');
        },
        error: (err) => {
          console.error('Error al iniciar sesión', err);
          alert('Error al iniciar sesión: ' + (err.error?.message || 'Credenciales incorrectas'));
        }
      });
    } else {
      console.log('El formulario no es válido');
      this.loginForm.markAllAsTouched();
    }
  }
  
}
