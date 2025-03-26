import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './buttons/button/button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ButtonComponent
  ],
  exports: [
    ButtonComponent
  ]
})
export class SharedUiModule {}