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

  constructor(private productSvc: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.productSvc.getAll().subscribe({
      next: data => { this.products = data || []; this.loading = false; },
      error: err => { this.error = 'Error cargando productos'; this.loading = false; console.error(err); }
    });
  }

  view(id?: number) {
    if (id) this.router.navigate(['/dashboard/product/detail', id]);
  }

  edit(id?: number) {
    if (id) this.router.navigate(['/dashboard/product/edit', id]);
  }

  delete(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar producto?')) return;
    this.productSvc.delete(id).subscribe({
      next: () => this.load(),
      error: err => { alert('Error al borrar'); console.error(err); }
    });
  }
}
