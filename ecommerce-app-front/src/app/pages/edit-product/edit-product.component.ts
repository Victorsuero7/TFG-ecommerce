import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  form: FormGroup;
  error: string | null = null;
  loading = false;
  categories: any[] = [];
  productId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private productSvc: ProductService,
    private categorySvc: CategoryService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      size: ['', Validators.required],
      categoryId: [null, Validators.required]
    });
  }
  
  productLoadedCategoryId: number | null = null;
  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';

 ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.productId = Number(params['id']);
  });
  this.loadCategories().then(() => {
    if (this.productId) {
      this.loadProduct(this.productId);
    }
  }).catch(err => {
    console.error('Error cargando categorías:', err);
  });
}

loadCategories(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.categorySvc.getAll().subscribe({
      next: data => {
        console.log('Categorias recibidas:', data);
        this.categories = data || [];
        resolve();
      },
      error: err => {
        console.error('Error cargando categorias', err);
        reject(err);
      }
    });
  });
}

loadProduct(id: number): void {
  this.loading = true;
  this.productSvc.getById(id).subscribe({
    next: (resp: any) => {
      const p = resp.message; 
      console.log(p)
      const catId  = Number(p?.category?.id ?? p?.categoryId);
      console.log('Categoria:', catId);
      this.productLoadedCategoryId = catId;
      this.form.patchValue({
        name: p?.name ?? '',
        description: p?.description ?? '',
        price: p?.price ?? 0,
        stock: p?.stock ?? 0,
        size: p?.size ?? '',
        categoryId: catId
      });
      this.loading = false;
    },
    error: err => {
      console.error('Error cargando producto', err);
      this.loading = false;
    }
  });
}



  submit(): void {
    if (this.form.invalid || !this.productId) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: any = {
      name: this.form.value.name,
      description: this.form.value.description,
      price: Number(this.form.value.price),
      stock: Number(this.form.value.stock),
      size: this.form.value.size,
      category: { id: Number(this.form.value.categoryId) }
    };

    this.productSvc.update(this.productId, payload).subscribe({
      next: () => {
        this.showToast('Producto actualizado', 'success');
        setTimeout(() => this.router.navigate(['/products/list']), 800);
      },
      error: err => {
        console.error('Error actualizando producto', err);
        this.showToast('Error al actualizar producto', 'error');
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
