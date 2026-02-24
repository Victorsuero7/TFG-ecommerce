import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Movement } from '../../models/movement.model';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private baseUrl = `${environment.apiUrl}/movement`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 1): Observable<{ data: Movement[], count: number }> {
    return this.http.get<any>(this.baseUrl, { params: { page: page.toString() } }).pipe(
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
    return this.http.get<any>(`${this.baseUrl}/product/${encodeURIComponent(name)}`, { params: { page: page.toString() } }).pipe(
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
