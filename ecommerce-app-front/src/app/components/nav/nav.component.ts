import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ThemeService } from '../../services/theme/theme.service';

/**
 * Componente de navegación principal de la aplicación.
 * Gestiona el cambio de tema y el cierre de sesión del usuario.
 */
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  /**
   * Alterna entre el tema claro y oscuro.
   */
  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  /**
   * Cierra la sesión del usuario y redirige al login.
   */
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
