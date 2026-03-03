import { Injectable, signal, computed } from '@angular/core';
const TOKEN_KEY = 'auth_token';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _loggedIn = signal(this.hasToken());

  readonly isLoggedIn = computed(() => this._loggedIn());

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
