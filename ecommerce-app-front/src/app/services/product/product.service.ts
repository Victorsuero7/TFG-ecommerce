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
      map((res: any) => {
        const inner = res?.result ?? res;
        const data = Array.isArray(inner?.result) ? inner.result : [];
        const totalCount = inner?.metadata?.count ?? 0;
        return { data, totalCount };
      })
    );
  }

  override create(item: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/insert`, item);
  }
}
