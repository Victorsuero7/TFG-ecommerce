import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, of, switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs';
import { MovementService } from '../../services/movement/movement.service';
import { Movement } from '../../models/movement.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
/**
 * Componente de listado de movimientos de inventario.
 * Muestra el historial de movimientos de stock con paginación y búsqueda
 * reactiva por nombre de producto.
 */
export class InventoryListComponent implements OnInit, OnDestroy {
  movements: Movement[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  currentPage = 1;
  totalItems = 0;
  pageSize = 10;
  totalPages = 0;

  private search$ = new Subject<string>();
  private searchSub!: Subscription;

  constructor(private movementSvc: MovementService) {}

  ngOnInit(): void {
    this.initPageSizeAndLoad();

    this.searchSub = this.search$.pipe(
      debounceTime(350),
      switchMap(term => {
        this.loading = true;
        if (!term.trim()) {
          return this.movementSvc.getAll(this.currentPage);
        }
        return this.movementSvc.searchByProductName(term, this.currentPage).pipe(catchError(() => of({ data: [], count: 0 })));
      })
    ).subscribe({
      next: res => {
        this.movements = res.data;
        this.totalItems = res.count;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.loading = false;
      },
      error: () => { this.error = 'Error en la búsqueda'; this.loading = false; }
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.movementSvc.getAll(this.currentPage).subscribe({
      next: res => {
        this.movements = res.data;
        this.totalItems = res.count;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.loading = false;
        console.log('Movements loaded:', this.movements);
      },
      error: err => {
        console.error('Error cargando movimientos', err);
        this.error = 'Error cargando movimientos';
        this.loading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    if (this.searchTerm.trim()) {
      this.search$.next(this.searchTerm);
    } else {
      this.load();
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.search$.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.search$.next('');
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  private initPageSizeAndLoad(): void {
    fetch(environment.apiUrl + '/config')
      .then(res => res.json())
      .then(cfg => {
        const configuredPageSize = Number(cfg?.productsPerPage);
        this.pageSize = configuredPageSize > 0 ? configuredPageSize : 10;
        this.load();
      })
      .catch(() => {
        this.pageSize = 10;
        this.load();
      });
  }
}
