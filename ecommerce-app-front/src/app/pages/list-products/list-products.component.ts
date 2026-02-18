import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, of, switchMap, debounceTime, distinctUntilChanged, catchError, forkJoin, map } from 'rxjs';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = false;
  error = '';
  selectedDeleteId?: number;
  searchTerm = '';
  searchField: 'all' | 'name' | 'description' | 'category' = 'all';
  minStock?: number;
  maxStock?: number;

  private search$ = new Subject<string>();
  private searchSub!: Subscription;

  constructor(private productSvc: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.load();

    this.searchSub = this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) {
          return this.productSvc.getAll();
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
      next: data => { this.applyStockFilter(data); this.loading = false; },
      error: () => { this.error = 'Error en la búsqueda'; this.loading = false; }
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.productSvc.getAll().subscribe({
      next: data => { 
        this.applyStockFilter(data); 
        this.loading = false; 
        console.log('Frontend: productos cargados', this.products);

      },
      error: err => {
        console.error('Frontend: error cargando productos', err);
        this.error = 'Error cargando productos'; this.loading = false;
      }
    });
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
    this.search$.next('');
  }

  formatPrice(p?: number) {
    if (p == null) return '-';
    const n = typeof p === 'number' ? p : Number(p);
    if (isNaN(n)) return '-';
    return n.toFixed(2) + ' €';
  }

  view(id?: number) { if (id) this.router.navigate(['/products/detail', id]); }
  edit(id?: number) { if (id) this.router.navigate(['/products/edit', id]); }

  openDeleteModal(id?: number) {
    if (!id) return;
    this.selectedDeleteId = id;
  }

  confirmDelete() {
    const id = this.selectedDeleteId;
    if (!id) return;
    this.productSvc.delete(id).subscribe({
      next: () => { this.load(); this.selectedDeleteId = undefined; },
      error: err => {
        alert('Error al borrar producto');
        console.error(err);
        this.selectedDeleteId = undefined;
      }
    });
  }
}
