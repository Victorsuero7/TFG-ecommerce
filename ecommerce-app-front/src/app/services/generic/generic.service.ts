import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


/**
 * Servicio genérico abstracto que provee operaciones CRUD básicas sobre un endpoint de la API.
 * Las clases hijas deben extenderlo indicando el tipo de entidad y el segmento de ruta.
 * @template T Tipo de entidad gestionada por el servicio.
 */
export abstract class GenericService<T> {
  constructor(protected http: HttpClient, protected endpoint: string) {}

  /** URL base construida a partir de la URL de la API y el endpoint del recurso. */
  protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  /**
   * Obtiene todos los elementos del recurso.
   * @returns Observable con el array de entidades.
   */
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }

  /**
   * Obtiene un elemento por su identificador.
   * @param id Identificador numérico del elemento.
   * @returns Observable con la entidad encontrada.
   */
  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crea un nuevo elemento.
   * @param item Datos de la entidad a crear.
   * @returns Observable con la entidad creada.
   */
  create(item: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, item);
  }

  /**
   * Actualiza un elemento existente.
   * @param id Identificador del elemento a actualizar.
   * @param item Nuevos datos de la entidad.
   * @returns Observable con la entidad actualizada.
   */
  update(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, item);
  }

  /**
   * Elimina un elemento por su identificador.
   * @param id Identificador del elemento a eliminar.
   * @returns Observable vacío al completarse.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
