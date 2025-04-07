import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './buttons/button/button.component';
import { PrimeNgModule } from './primeng/primeng.module';
import { PrimengDemoComponent } from './primeng-demo/primeng-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    PrimengDemoComponent  
  ],
  declarations: [
    ButtonComponent
  ],
  exports: [
    ButtonComponent,
    PrimeNgModule,
    PrimengDemoComponent
  ]
})
export class SharedUiModule { }