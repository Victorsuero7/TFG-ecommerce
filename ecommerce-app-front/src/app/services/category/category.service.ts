import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { Category } from '../../models/category.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

/**
 * Servicio para la gestión de categorías.
 * Extiende GenericService con operaciones específicas como búsqueda por nombre,
 * descripción y actualización múltiple.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService extends GenericService<Category> {
  constructor(http: HttpClient, private authService: AuthService, private router: Router) {
    super(http, 'category');
  }

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
   * Obtiene todas las categorías con autenticación.
   * @returns Observable con el array de categorías.
   */
  override getAll(): Observable<Category[]> {
  const options = this.getAuthHeaders();
  return this.http.get<Category[]>(`${this.baseUrl}`, options).pipe(
    map((res: any) => Array.isArray(res) ? res : (res?.result ?? res?.message ?? []))
  );
}

  /**
   * Obtiene una categoría por su identificador.
   * @param id Identificador de la categoría.
   * @returns Observable con la categoría encontrada.
   */
  override getById(id: number): Observable<Category> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/${id}`, options).pipe(
      map((res: any) => (res?.result ?? res?.message ?? res) as Category)
    );
  }

  /**
   * Busca categorías cuyo nombre coincida con el texto dado.
   * @param name Texto a buscar en el nombre.
   * @returns Observable con las categorías encontradas.
   */
  searchByName(name: string): Observable<Category[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/name/${encodeURIComponent(name)}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  /**
   * Busca categorías cuya descripción contenga el texto dado.
   * @param description Texto a buscar en la descripción.
   * @returns Observable con las categorías encontradas.
   */
  searchByDescription(description: string): Observable<Category[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/description/${encodeURIComponent(description)}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }
  
  /**
   * Crea una nueva categoría en el backend.
   * @param item Datos de la categoría a crear.
   * @returns Observable con la categoría creada.
   */
  override create(item: Category): Observable<Category> {
    const options = this.getAuthHeaders();
    return this.http.post<Category>(`${this.baseUrl}/insert`, item, options);
  }

  /**
   * Actualiza múltiples categorías en una sola petición.
   * @param items Array de categorías con los datos actualizados.
   * @returns Observable con la respuesta del servidor.
   */
  updateMany(items: Category[]): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.patch(`${this.baseUrl}/update/many`, items, options);
  }

  /**
   * Actualiza una categoría existente.
   * @param id Identificador de la categoría.
   * @param item Nuevos datos de la categoría.
   * @returns Observable con la categoría actualizada.
   */
  override update(id: number, item: Category): Observable<Category> {
    const options = this.getAuthHeaders();
    const data = { ...item, id };
    return this.http.patch<Category>(`${this.baseUrl}/update`, data, options);
  }


}
