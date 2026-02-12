import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { Product } from '../../models/product.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericService<Product> {
  constructor(http: HttpClient) {
    super(http, 'product');
  }

  override getAll(): Observable<Product[]> {
    return super.getAll().pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? res?.message ?? []))
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
}
