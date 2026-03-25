import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { User } from '../../models/user.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Product} from '../../models/product.model';
import {PaginatedResponse} from '../product/product.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

/**
 * Servicio para la gestión de usuarios.
 * Extiende GenericService con operaciones de registro, login,
 * verificación de email y borrado lógico.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService<User> {
  constructor(http: HttpClient, private authService: AuthService, private router: Router) {
    super(http, 'user');
  }

  /**
   * Construye las cabeceras de autorización con el token JWT.
   * @returns Objeto con cabeceras HTTP.
   */
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    if (token) {
      return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    } else {
      return { headers: new HttpHeaders() };
    }
  }

  /**
   * Obtiene usuarios de forma paginada.
   * @param page Número de página.
   * @returns Observable con los usuarios y el total de registros.
   */
  getAllPaginated(page: number): Observable<PaginatedResponse<Product>> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/all/${page}`, options).pipe(
      map((res: any) => ({
        data: res.data ?? [],
        totalCount: res.totalCount ?? 0
      }))
    );
  }
  
  /**
   * Comprueba si un email ya está registrado en el sistema.
   * @param email Email a verificar.
   * @returns Observable indicando si el email existe.
   */
  checkEmail(email: string): Observable<{ exists: boolean }> {
    const options = this.getAuthHeaders();
    return this.http.get<{ exists: boolean }>(`${this.baseUrl}/email-available?email=${encodeURIComponent(email)}`, options);
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param payload Datos del usuario a registrar.
   * @returns Observable con la respuesta del servidor.
   */
  signUp(payload: any): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/sign-up`, payload, options);
  }

  /**
   * Autentica al usuario con sus credenciales.
   * @param payload Credenciales de acceso (email y contraseña).
   * @returns Observable con el token JWT y datos del usuario.
   */
  login(payload: any): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/login`, payload, options);
  }

  /**
   * Realiza un borrado lógico del usuario.
   * @param id Identificador del usuario.
   * @returns Observable con la respuesta del servidor.
   */
  softdelete(id: number): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/delete/${id}`, options);
  }
}
