import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  // arranque de la app en dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // dashboard con páginas internas 
  { path: 'dashboard', component: DashboardComponent },

  // redirección
  { path: '**', redirectTo: 'dashboard' }
];
