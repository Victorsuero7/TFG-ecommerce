import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Movement } from '../../models/movement.model';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private baseUrl = `${environment.apiUrl}/movement`;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    if (token) {
      return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    } else {
      this.router.navigate(['/login']);
      return { headers: new HttpHeaders() };
    }
  }

  getAll(page: number = 1): Observable<{ data: Movement[], count: number }> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/all/${page}`, options).pipe(
      map((res: any) => {
        const data = Array.isArray(res) ? res : (res?.result ?? []);
        const count = res?.metadata?.count ?? data.length;
        return {
          data: data.map((m: any) => this.mapMovement(m)),
          count
        };
      })
    );
  }

  searchByProductName(name: string, page: number = 1): Observable<{ data: Movement[], count: number }> {
    const options = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/find`, { params: { name, page: page.toString() }, ...options }).pipe(
      map((res: any) => {
        const data = Array.isArray(res) ? res : (res?.result ?? []);
        const count = res?.metadata?.count ?? data.length;
        return {
          data: data.map((m: any) => this.mapMovement(m)),
          count
        };
      })
    );
  }
  private mapMovement(m: any): Movement {
    return {
      id: m.id,
      productName: m.product?.name ?? 'Producto eliminado',
      productId: m.product?.id ?? 0,
      finalStock: m.finalStock,
      modifiedByEmail: m.modifiedBy?.email ?? '-',
      lastModification: m.lastModification
    };
  }
}
