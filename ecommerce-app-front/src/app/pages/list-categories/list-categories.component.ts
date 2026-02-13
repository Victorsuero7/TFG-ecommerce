import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-list-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.css'
})
export class ListCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  error = '';

  constructor(private categorySvc: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.categorySvc.getAll().subscribe({
      next: data => { console.log('Frontend: categories response', data); this.categories = data || []; this.loading = false; },
      error: err => { console.error('Frontend: error fetching categories', err); this.error = 'Error cargando categorías'; this.loading = false; }
    });
  }

  view(id?: number) { if (id) this.router.navigate(['/dashboard/categories/detail', id]); }
  edit(id?: number) { if (id) this.router.navigate(['/categories/edit', id]); }

  delete(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar categoría?')) return;
    this.categorySvc.delete(id).subscribe({
      next: () => this.load(),
      error: err => { alert('Error al borrar categoría'); console.error(err); }
    });
  }
}
