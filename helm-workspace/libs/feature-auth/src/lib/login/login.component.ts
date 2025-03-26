import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'helm-workspace-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() loginError = new EventEmitter<string>();

  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    contrasena: new FormControl('', Validators.required),
  });

  usuarioPlaceholder: string = "";
  contrasenaPlaceholder: string = "";
  mostrarRecordar: boolean = true;
  mostrarDescubrir: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

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
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const usuario = this.loginForm.get('usuario')?.value || '';
      const contrasena = this.loginForm.get('contrasena')?.value || '';
      
      this.loginService.login(usuario, contrasena).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.loginSuccess.emit();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al iniciar sesión';
          this.loginError.emit(this.errorMessage);
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos';
      this.loginForm.markAllAsTouched();
    }
  }
}