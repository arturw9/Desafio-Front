import { bootstrapApplication } from '@angular/platform-browser';
import { ListaTitulos } from './app/components/lista-titulos/lista-titulos';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/components/app-component/app-component';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
