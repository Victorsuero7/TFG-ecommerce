import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'app_theme_mode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _mode = signal<ThemeMode>('light');
  readonly mode = this._mode.asReadonly();

  constructor() {
    this.initializeTheme();
  }

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