import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';
import { error } from 'console';
import { Router } from '@angular/router';


export interface ProductInventario extends Product {
  cantidad: number;
}
@Component({
  selector: 'app-create-inventario',
  imports: [],
  templateUrl: './create-inventario.component.html',
  styleUrl: './create-inventario.component.css'
})
export class CreateInventarioComponent {
  productos: ProductInventario[] = [];

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
        cantidad: 0
      }));
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
  const productosActualizados = this.productos
    .filter(p => p.cantidad > 0)
    .map(p => ({
      id: p.id as number,
      stock: (p.stock ?? 0) + p.cantidad
    }));

  this.productService.updateStock(productosActualizados)
    .subscribe({
          next: () => {
            this.showToast('Iventario actualizado', 'success');
            setTimeout(() => this.router.navigate(['/inventary/list']), 800);
          },
          error: err => {
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
