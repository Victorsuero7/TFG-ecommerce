import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {
  form!: FormGroup;
  categories: Category[] = [];
  loading = true;
  error = '';
  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private productSvc: ProductService, private categorySvc: CategoryService, public router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      size: ['', [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
    this.loadCategories();
  }
  ngOnInit(): void {
    const authToast = localStorage.getItem('auth_redirect_toast');
    if (authToast) {
      this.showToast(authToast, 'error');
      localStorage.removeItem('auth_redirect_toast');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const raw = this.form.value;
    const formData = new FormData();
    formData.append('name', raw.name);
    formData.append('description', raw.description);
    formData.append('price', String(raw.price));
    formData.append('size', raw.size);
    formData.append('stock', String(raw.stock));
    formData.append('categoryId', String(raw.categoryId));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.productSvc.createWithImage(formData).subscribe({
      next: () => {
        this.loading = false;
        this.showToast('Producto creado', 'success');
        setTimeout(() => this.router.navigate(['/products/list']), 800);
      },
      error: err => {
        console.error('Error creando product', err);
        this.error = 'Error creando producto';
        this.showToast('Error creando producto', 'error');
        this.loading = false;
      }
    });
  }

  private loadCategories(): void {
    this.categorySvc.getAll().subscribe({
      next: cats => this.categories = cats,
      error: err => {
        console.error('Error cargando categorias', err);
        this.showToast('Error al cargar categorías', 'error');
        this.categories = [];
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
