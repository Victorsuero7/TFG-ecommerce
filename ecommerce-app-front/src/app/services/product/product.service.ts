import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { Product } from '../../models/product.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericService<Product> {
  constructor(http: HttpClient) {
    super(http, 'product');
  }

  override getAll(): Observable<Product[]> {
    return super.getAll().pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result?.result ?? res?.result ?? []))
    );
  }

  getAllPaginated(page: number): Observable<PaginatedResponse<Product>> {
    return this.http.get<any>(`${this.baseUrl}/all/${page}`).pipe(
      map((res: any) => ({
      data: res.data ?? [],
      totalCount: res.totalCount ?? 0
    }))
    );
  }

  override create(item: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/insert`, item);
  }

  searchByName(name: string): Observable<Product[]> {
    return this.http.get<any>(`${this.baseUrl}/name/${encodeURIComponent(name)}`).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  searchByDescription(description: string): Observable<Product[]> {
    return this.http.get<any>(`${this.baseUrl}/description/${encodeURIComponent(description)}`).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  searchByCategoryName(categoryName: string): Observable<Product[]> {
    return this.http.get<any>(`${this.baseUrl}/category/${encodeURIComponent(categoryName)}`).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  searchByStock(min: number, max: number): Observable<Product[]> {
    return this.http.get<any>(`${this.baseUrl}/stock/${min}/${max}`).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  softdelete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  getDisabled(page: number = 1): Observable<Product[]> {
    return this.http.get<any>(`${this.baseUrl}/disabled/${page}`).pipe(
      map((res: any) => {
        const inner = res?.result ?? res;
        return Array.isArray(inner) ? inner : (inner?.result ?? []);
      })
    );
  }

  override update(id: number, item: Product): Observable<Product> {
  return this.http.patch<Product>(`${this.baseUrl}/update`, item);
  }

  updateMany(items: Product[]): Observable<any> {
    return this.http.patch(`${this.baseUrl}/update/many`, items);
  }

  uploadImage(id: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/upload-image/${id}`, formData);
  }
 
}
