
/**
 * Punto de entrada de la aplicación Angular.
 * Inicializa la aplicación arrancando el componente raíz con la configuración definida en appConfig.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
console.log('BOOTSTRAP!');
bootstrapApplication(AppComponent, appConfig);
