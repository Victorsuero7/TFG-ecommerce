import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { MovementService } from '../../services/movement/movement.service';
import { Movement } from '../../models/movement.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    latestMovements: Movement[] = [];
  loading = true;

  totalProducts = 0;
  totalCategories = 0;
  totalStock = 0;
  warehouseValue = 0;

  lowStockProducts: Product[] = [];
  latestProducts: Product[] = [];
  productsByCategory: { name: string; count: number; totalStock: number }[] = [];
  topValueProducts: Product[] = [];

  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';
  constructor(
    private productSvc: ProductService,
    private categorySvc: CategoryService,
    private movementSvc: MovementService
  ) {
    (window as any).showAuthToast = (message = 'Debes estar autenticado para acceder', kind: 'success' | 'error' | 'info' = 'error') => {
      localStorage.setItem('auth_redirect_toast', message);
      this.showToast(message, kind);
    };
  }

  showToast(message: string, kind: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastVariant = kind === 'success' ? 'success' : (kind === 'error' ? 'danger' : 'primary');
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3500);
  }

  hideToast() { this.toastVisible = false; }

  ngOnInit(): void {
    forkJoin([
      this.productSvc.getAll(),
      this.categorySvc.getAll(),
      this.movementSvc.getAll(1)
    ]).subscribe({
      next: ([products, categories, movements]) => {
        this.buildDashboard(products, categories);
        this.latestMovements = (movements.data ?? []).sort((a, b) => new Date(b.lastModification).getTime() - new Date(a.lastModification).getTime()).slice(0, 5);
        console.log('Dashboard datos:', { products, categories, movements });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private buildDashboard(products: Product[], categories: Category[]): void {
    const prods = (products).map((p: any) => ({
      ...p,
      categoryName: p?.category?.name ?? p?.categoryName ?? '-'
    }));

    this.totalProducts = prods.length;
    this.totalCategories = (categories || []).length;
    this.totalStock = prods.reduce((sum, p) => sum + (p.stock ?? 0), 0);
    this.warehouseValue = prods.reduce((sum, p) => sum + (Number(p.price) || 0) * (p.stock ?? 0), 0);

    this.lowStockProducts = prods
      .filter(p => (p.stock ?? 0) <= 20)
      .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
      .slice(0, 8);

    this.topValueProducts = [...prods]
      .sort((a, b) => ((Number(b.price) || 0) * (b.stock ?? 0)) - ((Number(a.price) || 0) * (a.stock ?? 0)))
      .slice(0, 5);

    this.latestProducts = [...prods]
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
      .slice(0, 5);

    const catMap = new Map<string, { count: number; totalStock: number }>();
    for (const p of prods) {
      const cat = p.categoryName || 'Sin categoría';
      const entry = catMap.get(cat) || { count: 0, totalStock: 0 };
      entry.count++;
      entry.totalStock += (p.stock ?? 0);
      catMap.set(cat, entry);
    }
    this.productsByCategory = Array.from(catMap.entries())
      .map(([name, v]) => ({ name, count: v.count, totalStock: v.totalStock }))
      .sort((a, b) => b.count - a.count);
  }

  formatPrice(n?: number): string {
    if (n == null) return '-';
    const v = typeof n === 'number' ? n : Number(n);
    return isNaN(v) ? '-' : v.toFixed(2) + ' €';
  }

  stockClass(stock?: number): string {
    if (stock == null) return '';
    if (stock === 0) return 'stock-out';
    if (stock <= 5) return 'stock-low';
    return 'stock-ok';
  }

  barWidth(count: number): number {
    if (!this.productsByCategory.length) return 0;
    const max = this.productsByCategory[0].count;
    return max > 0 ? (count / max) * 100 : 0;
  }
}

