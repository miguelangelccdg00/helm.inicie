import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'helm-workspace-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass']
})
export class ButtonComponent {
  @Input() type: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  
  @Output() clicked = new EventEmitter<void>();
  
  get buttonClasses(): string {
    const classes = ['button', `button-${this.type}`];
    
    if (this.size) {
      classes.push(`button-${this.size}`);
    }
    
    if (this.fullWidth) {
      classes.push('button-full-width');
    }
    
    return classes.join(' ');
  }
  
  onClick(event: Event): void {
    event.preventDefault();
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}