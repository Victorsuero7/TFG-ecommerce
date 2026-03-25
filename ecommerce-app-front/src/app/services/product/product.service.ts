 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { Product } from '../../models/product.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

/**
 * Interfaz que representa una respuesta paginada genérica del servidor.
 * @template T Tipo de los elementos devueltos.
 */
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}

/**
 * Servicio para la gestión de productos.
 * Extiende GenericService con operaciones de búsqueda, paginación,
 * carga de imágenes y borrado lógico.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericService<Product> {
  constructor(http: HttpClient, private authService: AuthService, private router: Router) {
    super(http, 'product');
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

  override getAll(): Observable<Product[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result?.result ?? res?.result ?? []))
    );
  }

  /**
   * Obtiene productos de forma paginada.
   * @param page Número de página.
   * @returns Observable con los productos y el total de registros.
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

  override create(item: Product): Observable<Product> {
    const options = this.getAuthHeaders();
    return this.http.post<Product>(`${this.baseUrl}/insert`, item, options);
  }

  /**
   * Busca productos por nombre.
   * @param name Texto a buscar.
   * @returns Observable con los productos encontrados.
   */
  searchByName(name: string): Observable<Product[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/name/${encodeURIComponent(name)}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  /**
   * Busca productos por descripción.
   * @param description Texto a buscar.
   * @returns Observable con los productos encontrados.
   */
  searchByDescription(description: string): Observable<Product[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/description/${encodeURIComponent(description)}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  /**
   * Busca productos por nombre de categoría.
   * @param categoryName Nombre de la categoría.
   * @returns Observable con los productos encontrados.
   */
  searchByCategoryName(categoryName: string): Observable<Product[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/category/${encodeURIComponent(categoryName)}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  /**
   * Busca productos cuyo stock esté entre los valores indicados.
   * @param min Stock mínimo.
   * @param max Stock máximo.
   * @returns Observable con los productos encontrados.
   */
  searchByStock(min: number, max: number): Observable<Product[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/stock/${min}/${max}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  /**
   * Realiza un borrado lógico del producto.
   * @param id Identificador del producto.
   * @returns Observable con la respuesta del servidor.
   */
  softdelete(id: number): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/delete/${id}`, options);
  }

  /**
   * Obtiene los productos deshabilitados de forma paginada.
   * @param page Número de página (por defecto 1).
   * @returns Observable con el array de productos deshabilitados.
   */
  getDisabled(page: number = 1): Observable<Product[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/disabled/${page}`, options).pipe(
      map((res: any) => {
        const inner = res?.result ?? res;
        return Array.isArray(inner) ? inner : (inner?.result ?? []);
      })
    );
  }

  override update(id: number, item: Product | FormData): Observable<Product> {
    const options = this.getAuthHeaders();
    return this.http.patch<Product>(`${this.baseUrl}/update`, item, options);
  }

  /**
   * Actualiza múltiples productos en una sola petición.
   * @param items Array de productos con los datos actualizados.
   * @returns Observable con la respuesta del servidor.
   */
  updateMany(items: Product[]): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.patch(`${this.baseUrl}/update/many`, items, options);
  }

  /**
   * Sube una imagen para un producto existente.
   * @param id Identificador del producto.
   * @param formData FormData con la imagen a subir.
   * @returns Observable con la respuesta del servidor.
   */
  uploadImage(id: number, formData: FormData): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/upload-image/${id}`, formData, options);
  }
  
  override getById(id: number): Observable<Product> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/${id}`, options).pipe(
      map((res: any) => {
        console.log('getById backend response:', res);
        return res?.result ?? res?.message ?? res;
      })
    );
  }
  /**
   * Crea un nuevo producto junto con su imagen en una sola petición.
   * @param formData FormData con los datos del producto e imagen.
   * @returns Observable con el producto creado.
   */
  createWithImage(formData: FormData): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/insert`, formData, options);
  }
}
