import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { Category } from '../../models/category.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends GenericService<Category> {
  constructor(http: HttpClient, private authService: AuthService, private router: Router) {
    super(http, 'category');
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

  override getAll(): Observable<Category[]> {
  const options = this.getAuthHeaders();
  return this.http.get<Category[]>(`${this.baseUrl}`, options).pipe(
    map((res: any) => Array.isArray(res) ? res : (res?.result ?? res?.message ?? []))
  );
}

  searchByName(name: string): Observable<Category[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/name/${encodeURIComponent(name)}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  searchByDescription(description: string): Observable<Category[]> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/description/${encodeURIComponent(description)}`, options).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }
  
  override create(item: Category): Observable<Category> {
    const options = this.getAuthHeaders();
    return this.http.post<Category>(`${this.baseUrl}/insert`, item, options);
  }

  updateMany(items: Category[]): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.patch(`${this.baseUrl}/update/many`, items, options);
  }

  override update(id: number, item: Category): Observable<Category> {
    const options = this.getAuthHeaders();
    const data = { ...item, id };
    return this.http.patch<Category>(`${this.baseUrl}/update`, data, options);
  }


}
