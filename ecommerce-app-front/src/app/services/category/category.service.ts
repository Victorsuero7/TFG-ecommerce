import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { Category } from '../../models/category.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends GenericService<Category> {
  constructor(http: HttpClient) {
    super(http, 'category');
  }

  override getAll(): Observable<Category[]> {
    return super.getAll().pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? res?.message ?? []))
    );
  }

  searchByName(name: string): Observable<Category[]> {
    return this.http.get<any>(`${this.baseUrl}/name/${encodeURIComponent(name)}`).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }

  searchByDescription(description: string): Observable<Category[]> {
    return this.http.get<any>(`${this.baseUrl}/description/${encodeURIComponent(description)}`).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.result ?? []))
    );
  }
  
  override create(item: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/insert`, item);
  }

  override update(id: number, item: Category): Observable<Category> {
    const data = { ...item, id };
    return this.http.patch<Category>(`${this.baseUrl}/update`, data);
  }


}
