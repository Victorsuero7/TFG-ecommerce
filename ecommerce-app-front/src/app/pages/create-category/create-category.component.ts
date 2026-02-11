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

  constructor(private fb: FormBuilder, private categorySvc: CategoryService, public router: Router) {
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
        this.router.navigate(['/categories/list']);
      },
      error: err => {
        console.error('Error creating category', err);
        this.error = 'Error creando categoría';
        this.loading = false;
      }
    });
  }
}
