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
      map((res: any) => Array.isArray(res) ? res : (res?.message ?? []))
    );
  }
  
  override create(item: Category): Observable<Category> {
    // backend expects POST to /category/insert
    return this.http.post<Category>(`${this.baseUrl}/insert`, item);
  }
}
