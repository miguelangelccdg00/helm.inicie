import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistroService, RegistroResponse } from './registro.service';

@Component({
  selector: 'helm-workspace-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.sass']
})
export class RegistroComponent {
  @Output() registroSuccess = new EventEmitter<number>();
  @Output() registroError = new EventEmitter<string>();

  registroForm = new FormGroup({
    usuario: new FormControl('', [Validators.required, Validators.minLength(4)]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmarContrasena: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email])
  });

  usuarioPlaceholder: string = "";
  contrasenaPlaceholder: string = "";
  confirmarContrasenaPlaceholder: string = "";
  emailPlaceholder: string = "";
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private registroService: RegistroService) {
    this.updatePlaceholders(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const screenWidth = (event.target as Window).innerWidth;
    this.updatePlaceholders(screenWidth);
  }

  updatePlaceholders(width: number) {
    if (width <= 500) {
      this.usuarioPlaceholder = "Nombre de usuario";
      this.contrasenaPlaceholder = "Contraseña";
      this.confirmarContrasenaPlaceholder = "Confirmar contraseña";
      this.emailPlaceholder = "Email (opcional)";
    } else {
      this.usuarioPlaceholder = "Introduce tu nombre de usuario";
      this.contrasenaPlaceholder = "Introduce tu contraseña";
      this.confirmarContrasenaPlaceholder = "Confirma tu contraseña";
      this.emailPlaceholder = "Introduce tu email (opcional)";
    }
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const contrasena = this.registroForm.get('contrasena')?.value || '';
      const confirmarContrasena = this.registroForm.get('confirmarContrasena')?.value || '';
      
      if (contrasena !== confirmarContrasena) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }
      
      this.isLoading = true;
      this.errorMessage = '';
      
      const usuario = this.registroForm.get('usuario')?.value || '';
      const email = this.registroForm.get('email')?.value || undefined;
      
      this.registroService.registrarUsuario(usuario, contrasena, email).subscribe({
        next: (response: RegistroResponse) => {
          this.isLoading = false;
          if (response.id) {
            this.registroSuccess.emit(response.id);
          } else {
            this.registroSuccess.emit(0); // Emitir un valor por defecto si no hay ID
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al registrar usuario';
          this.registroError.emit(this.errorMessage);
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente';
      this.registroForm.markAllAsTouched();
    }
  }
}