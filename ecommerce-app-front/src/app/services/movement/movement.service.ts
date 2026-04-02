import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Movement } from '../../models/movement.model';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

/**
 * Servicio para la gestión de movimientos de stock.
 * Permite consultar el historial de movimientos con paginación y búsqueda por nombre de producto.
 */
@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private baseUrl = `${environment.apiUrl}/movement`;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  /**
   * Construye las cabeceras de autorización con el token JWT.
   * Si no hay token, redirige al login.
   * @returns Objeto con cabeceras HTTP.
   */
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    if (token) {
      return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    } else {
      if (typeof window !== 'undefined' && typeof (window as any).showAuthToast === 'function') {
        (window as any).showAuthToast();
        setTimeout(() => this.router.navigate(['/login']), 100);
      } else {
        this.router.navigate(['/login']);
      }
      return { headers: new HttpHeaders() };
    }
  }

  /**
   * Obtiene todos los movimientos paginados.
   * @param page Número de página (por defecto 1).
   * @returns Observable con los movimientos y el total de registros.
   */
  getAll(page: number = 1): Observable<{ data: Movement[], count: number }> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/all/${page}`, options).pipe(
      map((res: any) => {
        const data = Array.isArray(res) ? res : (res?.result ?? []);
        const count = res?.metadata?.count ?? data.length;
        return {
          data: data.map((m: any) => this.mapMovement(m)),
          count
        };
      })
    );
  }

  /**
   * Busca movimientos filtrando por nombre de producto.
   * @param name Nombre del producto a buscar.
   * @param page Número de página (por defecto 1).
   * @returns Observable con los movimientos coincidentes y el total de registros.
   */
  searchByProductName(name: string, page: number = 1): Observable<{ data: Movement[], count: number }> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/find`, { params: { name, page: page.toString() }, ...options }).pipe(
      map((res: any) => {
        const data = Array.isArray(res) ? res : (res?.result ?? []);
        const count = res?.metadata?.count ?? data.length;
        return {
          data: data.map((m: any) => this.mapMovement(m)),
          count
        };
      })
    );
  }
  /**
   * Mapea la respuesta del backend al modelo Movement del frontend.
   * @param m Objeto raw recibido del servidor.
   * @returns Entidad Movement normalizada.
   */
  private mapMovement(m: any): Movement {
    return {
      id: m.id,
      productName: m.product?.name ?? 'Producto eliminado',
      productId: m.product?.id ?? 0,
      finalStock: m.finalStock,
      modifiedByEmail: m.modifiedBy?.email ?? '-',
      lastModification: m.lastModification
    };
  }
}
