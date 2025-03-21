import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app.config.server';

@NgModule({
  imports: [
    ServerModule,
  ],
})
export class AppServerModule {
  static bootstrap() {
    return bootstrapApplication(AppComponent, config);
  }
}