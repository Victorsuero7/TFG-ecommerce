import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'app_theme_mode';

/**
 * Servicio encargado de gestionar el tema visual de la aplicación (claro/oscuro).
 * Persiste la preferencia en localStorage y aplica el atributo de Bootstrap al documento.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _mode = signal<ThemeMode>('light');

  /** Señal de solo lectura con el modo de tema actual. */
  readonly mode = this._mode.asReadonly();

  constructor() {
    this.initializeTheme();
  }

  /**
   * Indica si el tema actual es oscuro.
   * @returns `true` si el modo es 'dark'.
   */
  isDark(): boolean {
    return this._mode() === 'dark';
  }

  toggleTheme(): void {
    this.setTheme(this._mode() === 'dark' ? 'light' : 'dark');
  }

  setTheme(mode: ThemeMode): void {
    this._mode.set(mode);

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-bs-theme', mode);
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  }

  private initializeTheme(): void {
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      this.setTheme(storedTheme);
      return;
    }

    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      this.setTheme('dark');
      return;
    }

    this.setTheme('light');
  }

  private getStoredTheme(): ThemeMode | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'dark' || value === 'light' ? value : null;
  }
}