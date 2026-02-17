import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { User } from '../../models/user.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService extends GenericService<User> {
  constructor(http: HttpClient) {
    super(http, 'user'); 
  }

  override getAll(): Observable<User[]> {
    return super.getAll().pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.message ?? []))
    );
  }
  checkEmail(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.baseUrl}/email/${encodeURIComponent(email)}`);
  }

  signUp(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/sign-up`, payload);
  }

  login(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }
}
