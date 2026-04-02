import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

console.log('AuthInterceptor loaded!');

/**
 * Interceptor HTTP que adjunta el token JWT de autenticación a cada petición saliente.
 * Si no hay token disponible, la petición continúa sin cabecera de autorización.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Intercepta la petición HTTP y añade la cabecera Authorization con el token Bearer si existe.
   * @param req Petición HTTP original.
   * @param next Manejador para continuar la cadena de interceptores.
   * @returns Observable con el evento HTTP resultante.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    console.log('Interceptor token:', token, 'URL:', req.url);
    
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.log('Token expirado o inválido (401). Limpiando sesión...');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(req);
  }
}
