import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
})

export class LoginComponent {

  // Formulario reactivo con dos campos: usuario y contraseña
  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    contrasena: new FormControl('', Validators.required),
    recordar: new FormControl(false),
  });

  // Placeholders dinámicos y banderas de visualización según el ancho de la pantalla
  usuarioPlaceholder: string = "";
  contrasenaPlaceholder: string = "";
  mostrarRecordar: boolean = true;
  mostrarDescubrir: boolean = false;

  // Constructor: se inyectan el servicio de login y el router
  constructor(private loginService: LoginService, private router: Router) {
    // Inicializa los placeholders según el ancho actual de la ventana
    this.updatePlaceholders(window.innerWidth);
  }

  // Escucha los cambios de tamaño de ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const screenWidth = (event.target as Window).innerWidth;
    this.updatePlaceholders(screenWidth);
  }

  // Actualiza los placeholders y banderas de visualización según el ancho
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

  // Lógica que se ejecuta al enviar el formulario
  onSubmit() {
    // Si el formulario es válido
    if (this.loginForm.valid) {
      const { usuario, contrasena } = this.loginForm.value;

      // Valores por defecto si son null
      const usuarioFinal = usuario ?? '';
      const contrasenaFinal = contrasena ?? '';
        
      // Llama al servicio de login
      this.loginService.login(usuarioFinal, contrasenaFinal).subscribe({
        next: (response) => {
          // Si el login fue exitoso, guarda el usuario y redirige
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            alert('Inicio de sesión exitoso');
            this.router.navigate(['/menu']);
          } else {
            // Si el backend no devolvió usuario
            alert('Usuario o contraseña incorrectos');
          }
        },
        error: (err) => {
          // Manejo de errores
          alert('Error al iniciar sesión: ' + (err.error?.message || 'Credenciales incorrectas'));
        }
      });
    } else {
      // Si el formulario no es válido, muestra errores
      console.log('El formulario no es válido');
      this.loginForm.markAllAsTouched();
    }
  }
  
}