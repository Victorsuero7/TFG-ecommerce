import { Injectable, signal, computed } from '@angular/core';
const TOKEN_KEY = 'auth_token';

/**
 * Servicio encargado de gestionar la autenticación del usuario.
 * Almacena y recupera el token JWT en localStorage y expone el estado de sesión.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _loggedIn = signal(this.hasToken());

  /** Señal de solo lectura que indica si el usuario tiene sesión activa. */
  readonly isLoggedIn = computed(() => this._loggedIn());

  /**
   * Inicia sesión almacenando el token JWT en localStorage.
   * @param token Token JWT recibido tras la autenticación.
   */
  login(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(TOKEN_KEY, token);
      this._loggedIn.set(true);
    }
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(TOKEN_KEY);
      this._loggedIn.set(false);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  private hasToken(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
