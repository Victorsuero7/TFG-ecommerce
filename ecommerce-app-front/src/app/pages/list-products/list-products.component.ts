import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';
  selectedDeleteId?: number;

  readonly PAGE_SIZE = 2;
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  pages: number[] = [];

  constructor(private productSvc: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.productSvc.getAllPaginated(this.currentPage).subscribe({
      next: res => {
        console.log('Paginated response:', res);
        console.log('Data:', res.data);
        console.log('TotalCount:', res.totalCount);
        const list = (res.data || []).map((p: any) => ({
          ...p,
          categoryName: p?.category?.name ?? p?.categoryName ?? null
        }));
        console.log('Mapped list:', list);
        this.products = list;
        this.totalCount = res.totalCount;
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
      error: err => { alert('Error al borrar producto'); console.error(err); this.selectedDeleteId = undefined; }
    });
  }
}
