 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { Product } from '../../models/product.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericService<Product> {
  constructor(http: HttpClient, private authService: AuthService, private router: Router) {
    super(http, 'product');
  }

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

  searchByName(name: string): Observable<Product[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/name/${encodeURIComponent(name)}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  searchByDescription(description: string): Observable<Product[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/description/${encodeURIComponent(description)}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  searchByCategoryName(categoryName: string): Observable<Product[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/category/${encodeURIComponent(categoryName)}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  searchByStock(min: number, max: number): Observable<Product[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/stock/${min}/${max}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  softdelete(id: number): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/delete/${id}`, options);
  }

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

  updateMany(items: Product[]): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.patch(`${this.baseUrl}/update/many`, items, options);
  }

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
  createWithImage(formData: FormData): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/insert`, formData, options);
  }
}
