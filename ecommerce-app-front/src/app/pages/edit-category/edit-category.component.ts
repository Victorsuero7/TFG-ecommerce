import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';
@Component({
  selector: 'app-edit-category',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit{
  
  form: FormGroup;
  error: string | null = null;
  loading = true;
  categories: any[] = [];
  categoryId ?: number;
  

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private categorySvc: CategoryService
  ){
    (window as any).showAuthToast = () => {
      this.showToast('Debes estar autenticado para acceder', 'error');
    };
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';


  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = Number(params['id']);
    });
    this.loadCategories();
  }

  loadCategories(): Promise<void> {
    return new Promise ((resolve, reject) => {
      this.categorySvc.getAll().subscribe({
        next: data => {
          console.log('Categorías recibidas:', data);
          this.categories = data || [];
          resolve();
        },
        error: err => {
          console.error('Error cargando categorías', err);
          reject(err);
        }
      });
    });
  }

  submit(): void {
    if (this.form.invalid || !this.categoryId) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: any = {
      name: this.form.value.name,
      description: this.form.value.description
    };

    this.categorySvc.update(this.categoryId, payload).subscribe({
      next: () => {
        this.showToast('Categoría actualizada', 'success');
        setTimeout(() => this.router.navigate(['/categories/list']), 800);
      },
      error: err => {
        console.error('Error actualizando categoría', err);
        this.showToast('Error al actualizar categoría', 'error');
      }
    });

  }

  showToast(message: string, kind: 'success' | 'error' | 'info' = 'info'){
    this.toastMessage = message;
    this.toastVariant = kind === 'success' ? 'success' : (kind === 'error' ? 'danger' : 'primary');
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3500);
  }
  
  hideToast() { this.toastVisible = false;}
  

}
