import { Injectable, signal, computed } from '@angular/core';
import { UserRole } from '../../models/user.model';
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

  getRole(): UserRole | null {
    const payload = this.decodePayload();
    const role = payload?.['role'];

    if (role === 'ADMIN' || role === 'ROOT' || role === 'USER' || role === 'VIEW_ONLY') {
      return role;
    }

    return null;
  }

  isViewOnly(): boolean {
    return this.getRole() === 'VIEW_ONLY';
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const role = this.getRole();
    return role != null && roles.includes(role);
  }

  isTokenExpired(): boolean {
    const payload = this.decodePayload();
    if (!payload || !payload['exp']) return true;

    const expirationTime = (payload['exp'] as number) * 1000; 
    const currentTime = Date.now();

    return currentTime > expirationTime;
  }

  private hasToken(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const hasToken = !!localStorage.getItem(TOKEN_KEY);
    
    if (hasToken && this.isTokenExpired()) {
      this.logout();
      return false;
    }

    return hasToken;
  }

  private decodePayload(): Record<string, unknown> | null {
    const token = this.getToken();
    if (!token || typeof window === 'undefined') return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }
}
