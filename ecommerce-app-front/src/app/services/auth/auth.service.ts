import { Injectable, signal, computed } from '@angular/core';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _loggedIn = signal(this.hasToken());

  readonly isLoggedIn = computed(() => this._loggedIn());

  login(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this._loggedIn.set(true);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._loggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private hasToken(): boolean {
    if (typeof localStorage === 'undefined') return false;  
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
