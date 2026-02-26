import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { User } from '../../models/user.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Product} from '../../models/product.model';
import {PaginatedResponse} from '../product/product.service';

@Injectable({
  providedIn: 'root'
})

export class UserService extends GenericService<User> {
  constructor(http: HttpClient) {
    super(http, 'user'); 
  }

  getAllPaginated(page: number): Observable<PaginatedResponse<Product>> {
      return this.http.get<any>(`${this.baseUrl}/all/${page}`).pipe(
        map((res: any) => ({
        data: res.data ?? [],
        totalCount: res.totalCount ?? 0
      }))
      );
    }
  
  checkEmail(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.baseUrl}/email-available?email=${encodeURIComponent(email)}`);
  }

  signUp(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/sign-up`, payload);
  }

  login(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

   softdelete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}
