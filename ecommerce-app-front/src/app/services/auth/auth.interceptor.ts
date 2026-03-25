import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
console.log('AuthInterceptor loaded!');

/**
 * Interceptor HTTP que adjunta el token JWT de autenticación a cada petición saliente.
 * Si no hay token disponible, la petición continúa sin cabecera de autorización.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

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
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
