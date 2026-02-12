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

  constructor(private productSvc: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.productSvc.getAll().subscribe({
        next: data => {
          console.log('Frontend: products response', data);
          const list = data.map((p: any) => ({
            ...p,
            categoryName: p?.category?.name ?? p?.categoryName ?? null
          }));
          this.products = list;
          this.loading = false;
        },
      error: err => { console.error('Frontend: error cargabdi  productos', err); this.error = 'Error cargando productos'; this.loading = false; }
    });
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
