import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent {
  form!: FormGroup;
  loading = false;
  error = '';
  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';

  constructor(private fb: FormBuilder, private categorySvc: CategoryService, public router: Router) {
    if (typeof window !== 'undefined') {
      (window as any).showAuthToast = () => {
        this.showToast('Debes estar autenticado para acceder', 'error');
      };
    }
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const raw = this.form.value;
    const payload = { name: raw.name, description: raw.description };
    this.categorySvc.create(payload as any).subscribe({
      next: () => {
        this.loading = false;
        this.showToast('Categoria creada', 'success');
        setTimeout(() => this.router.navigate(['/categories/list']), 800);
      },
      error: err => {
        this.loading = false;
        if (err && err.status === 401) {
          this.showToast('Debes estar autenticado para acceder', 'error');
          setTimeout(() => this.router.navigate(['/login']), 100);
        } else {
          console.error('Error creando categoria', err);
          this.showToast('Error al crear categoría', 'error');
        }
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
