import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, of, switchMap, debounceTime, distinctUntilChanged, catchError, forkJoin, map } from 'rxjs';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = true;
  error = '';
  selectedDeleteId?: number;

  PAGE_SIZE = 10;
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  pages: number[] = [];
  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';
  searchTerm = '';
  searchField: 'all' | 'name' | 'description' | 'category' = 'all';
  minStock?: number;
  maxStock?: number;
  showDisabled = false;
  isViewOnly = false;

  private search$ = new Subject<string>();
  private searchSub!: Subscription;

  constructor(private productSvc: ProductService, private router: Router, private authSvc: AuthService) {
    (window as any).showAuthToast = () => {
      localStorage.setItem('auth_redirect_toast', 'Debes estar autenticado para acceder');
      this.showToast('Debes estar autenticado para acceder', 'error');
    };
    const authToast = localStorage.getItem('auth_redirect_toast');
    if (authToast) {
      this.showToast(authToast, 'error');
      localStorage.removeItem('auth_redirect_toast');
    }
  }

  ngOnInit(): void {
    this.isViewOnly = this.authSvc.isViewOnly();

    fetch(environment.apiUrl + '/config')
      .then(res => res.json())
      .then(cfg => {
        this.PAGE_SIZE = cfg.productsPerPage ?? 10;
        this.load();
      })
      .catch(() => {
        this.PAGE_SIZE = 10;
        this.load();
      });

    this.searchSub = this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) {
           this.loading = false;
            this.currentPage = 1;
            this.load();      
            return of(null);
        }
        this.loading = true;
        if (this.searchField === 'name') {
          return this.productSvc.searchByName(term).pipe(catchError(() => of([])));
        }
        if (this.searchField === 'description') {
          return this.productSvc.searchByDescription(term).pipe(catchError(() => of([])));
        }
        if (this.searchField === 'category') {
          return this.productSvc.searchByCategoryName(term).pipe(catchError(() => of([])));
        }
        return forkJoin([
          this.productSvc.searchByName(term).pipe(catchError(() => of([]))),
          this.productSvc.searchByDescription(term).pipe(catchError(() => of([]))),
          this.productSvc.searchByCategoryName(term).pipe(catchError(() => of([])))
        ]).pipe(
          map(([byName, byDesc, byCat]) => {
            const merged = new Map<number, Product>();
            for (const p of [...byName, ...byDesc, ...byCat]) {
              if (p.id != null) merged.set(p.id, p);
            }
            return Array.from(merged.values());
          })
        );
      })
    ).subscribe({
      next: data => {
        if (data !== null) {
          this.currentPage = 1;
          this.applyStockFilter(data);
          this.totalCount = Array.isArray(data) ? data.length : 0;
          this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.PAGE_SIZE));
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
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
    if (this.showDisabled) {
      this.productSvc.getDisabled(this.currentPage).subscribe({
        next: res => {
          const list = (res || []).map((p: any) => ({
            ...p,
            categoryName: p?.category?.name ?? p?.categoryName ?? null
          }));
          this.products = list;
          this.totalCount = list.length;
          this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.PAGE_SIZE));
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.loading = false;
        },
        error: err => {
          console.error('Error cargando productos inactivos', err);
          this.error = 'Error cargando productos inactivos';
          this.loading = false;
        }
      });
    } else {
        this.productSvc.getAllPaginated(this.currentPage).subscribe({
            next: ({ data, totalCount }) => {
              const list = (data || []).map((p: any) => ({
                ...p,
                categoryName: p?.category?.name ?? p?.categoryName ?? null
              }));

              this.products = list;
              this.totalCount = totalCount;
              this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.PAGE_SIZE));
              this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
              this.loading = false;
            },      
        error: err => {
          console.error('Error cargando productos', err);
          this.error = 'Error cargando productos';
          this.loading = false;
        }
      });
    }
  }

  onToggleDisabled(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.load();
  }

  private mapProducts(data: any[]): any[] {
    return (data || []).map((p: any) => ({
      ...p,
      categoryName: p?.category?.name ?? p?.categoryName ?? null
    }));
  }

  private allProducts: Product[] = [];

  private applyStockFilter(data: any[]): void {
    this.allProducts = this.mapProducts(data);
    this.filterByStock();
  }

  private filterByStock(): void {
    let products = [...this.allProducts];
    if (this.minStock != null && this.minStock > 0) {
      products = products.filter(p => (p.stock ?? 0) >= this.minStock!);
    }
    if (this.maxStock != null && this.maxStock > 0) {
      products = products.filter(p => (p.stock ?? 0) <= this.maxStock!);
    }
    this.products = products;
  }

  onSearch(): void {
    this.search$.next(this.searchTerm);
  }

  onStockFilterChange(): void {
    this.filterByStock();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.search$.next('');
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.load();
  }

  formatPrice(p?: number) {
    if (p == null) return '-';
    const n = typeof p === 'number' ? p : Number(p);
    if (isNaN(n)) return '-';
    return n.toFixed(2) + ' €';
  }

  view(id?: number) { if (id) this.router.navigate(['/products/detail', id]); }
  edit(id?: number) {
    if (this.isViewOnly) return;
    if (id) this.router.navigate(['/products/edit', id]);
  }

  openDeleteModal(id?: number) {
    if (this.isViewOnly) return;
    if (!id) return;
    this.selectedDeleteId = id;
  }

  confirmDelete() {
    if (this.isViewOnly) return;
    const id = this.selectedDeleteId;
    if (!id) return;
    this.productSvc.softdelete(id).subscribe({
      next: () => {
        this.showToast('Producto desactivado correctamente', 'success');
        this.load();
        this.selectedDeleteId = undefined;
      },
      error: err => {
        this.showToast('Error al desactivar producto', 'error');
        console.error(err);
        this.selectedDeleteId = undefined;
      }
    });
  }

  showToast(message: string, kind: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastVariant = kind === 'success' ? 'success' : (kind === 'error' ? 'danger' : 'primary');
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3500);
  }

  hideToast() { this.toastVisible = false; }
}
