import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from '../../services/category/category.service';
import {Category} from '../../models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-detail',
  imports: [CommonModule],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
/**
 * Componente de detalle de categoría.
 * Carga y muestra la información de una categoría a partir del id de la ruta.
 */
export class CategoryDetailComponent {
 category?: Category;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private CategorySvc: CategoryService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.CategorySvc.getById(id).subscribe({
        next: (cat) => {
          console.log('Respuesta getById:', cat);
          const c = (cat as any).result ?? cat;
          this.category = c;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar la categoría';
          this.loading = false;
          console.error('Error getById:', err);
        }
      });
    }
  }

  
}
