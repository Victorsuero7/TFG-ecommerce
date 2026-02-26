import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';
import { Router } from '@angular/router';


export interface ProductInventario extends Product {
  cantidad: number;
  stockOriginal: number;
}
@Component({
  selector: 'app-create-inventario',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-inventario.component.html',
  styleUrls: ['./create-inventario.component.css']
})
export class CreateInventarioComponent {
  productos: ProductInventario[] = [];
  loading = false;

  constructor(private productService: ProductService, public router: Router) {}
  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(products => {
      this.productos = products.map(p => ({
        ...p,
        stockOriginal: p.stock ?? 0,
        cantidad: p.stock ?? 0
      }));
       console.log('Producto cargado para inventario:', products);
    });
  }

  aumentar(producto: ProductInventario) {
    producto.cantidad++;
  }

  disminuir(producto: ProductInventario) {
    if (producto.cantidad > 0) {
      producto.cantidad--;
    }
  }

  guardarInventario() {
  this.loading = true;
  const productosActualizados = this.productos
    .filter(p => p.cantidad !== p.stockOriginal)
    .map(p => ({
      ...p,
      stock: p.cantidad
    }));

  if (productosActualizados.length === 0) {
    this.showToast('No hay cambios que guardar', 'info');
    this.loading = false;
    return;
  }

  this.productService.updateMany(productosActualizados as any)
    .subscribe({
          next: () => {
            this.loading = false;
            this.showToast('Inventario actualizado', 'success');
            setTimeout(() => this.router.navigate(['/inventory/list']), 800);
          },
          error: err => {
            this.loading = false;
            console.error('Error actualizando inventario', err);
            this.showToast('Error al actualizar inventario', 'error');
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
