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

  loading = false;
  error = '';

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

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const raw = this.form.value;
    const payload = {
      name: raw.name,
      description: raw.description,
      price: Number(raw.price),
      size: raw.size,
      stock: Number(raw.stock),
      category: { id: Number(raw.categoryId) }
    };
    this.productSvc.create(payload as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/products/list']);
      },
      error: err => {
        console.error('Error creating product', err);
        this.error = 'Error creando producto';
        this.loading = false;
      }
    });
  }

  private loadCategories(): void {
    this.categorySvc.getAll().subscribe({
      next: cats => this.categories = cats,
      error: err => {
        console.error('Error loading categories', err);
        this.categories = [];
      }
    });
  }
}
