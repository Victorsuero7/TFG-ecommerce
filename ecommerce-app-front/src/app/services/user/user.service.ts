import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { User } from '../../models/user.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {PaginatedResponse} from '../product/product.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserService extends GenericService<User> {
  constructor(http: HttpClient, private authService: AuthService, private router: Router) {
    super(http, 'user');
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    if (token) {
      return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    } else {
      return { headers: new HttpHeaders() };
    }
  }

  getAllPaginated(page: number): Observable<PaginatedResponse<User>> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/all/${page}`, options).pipe(
      map((res: any) => ({
        data: res.data ?? [],
        totalCount: res.totalCount ?? 0
      }))
    );
  }

  override getById(id: number): Observable<User> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/${id}`, options).pipe(
      map((res: any) => (res?.message?.result ?? res?.result ?? res?.message ?? res) as User)
    );
  }

  override update(id: number, item: User): Observable<User> {
    const options = this.getAuthHeaders();
    const payload = { ...item, id };
    return this.http.patch<any>(`${this.baseUrl}/update`, payload, options).pipe(
      map((res: any) => (res?.user?.result ?? res?.user ?? res?.result ?? res?.message ?? res) as User)
    );
  }
  
  checkEmail(email: string): Observable<{ exists: boolean }> {
    const options = this.getAuthHeaders();
    return this.http.get<{ exists: boolean }>(`${this.baseUrl}/email-available?email=${encodeURIComponent(email)}`, options);
  }

  signUp(payload: any): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/sign-up`, payload, options);
  }

  login(payload: any): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/login`, payload, options);
  }

  softdelete(id: number): Observable<any> {
    const options = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/delete/${id}`, options);
  }
}
