import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import {environment} from '../../../environments/environment';

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
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  productImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private productSvc: ProductService,
    private categorySvc: CategoryService
  ) {
    (window as any).showAuthToast = () => {
      this.showToast('Debes estar autenticado para acceder', 'error');
    };
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
      const p = resp.result ?? resp;
      const catId = p?.category?.id ?? p?.categoryId ?? null;
      this.productLoadedCategoryId = catId ? Number(catId) : null;
      this.form.patchValue({
        name: p?.name ?? '',
        description: p?.description ?? '',
        price: p?.price ?? 0,
        stock: p?.stock ?? 0,
        size: p?.size ?? '',
        categoryId: this.productLoadedCategoryId
      });
      this.productImageUrl = this.getImageUrl(p?.imageUrl || null);
      console.log('[loadProduct] productImageUrl set:', this.productImageUrl);
      this.loading = false;
    },
    error: err => {
      console.error('Error cargando producto', err);
      this.loading = false;
    }
  });
  
}
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
      console.log('[onFileSelected] imageUrl set:', this.imageUrl);
    }
  }



  submit(): void {
    if (this.form.invalid || !this.productId) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('id', String(this.productId));
    formData.append('name', this.form.value.name);
    formData.append('description', this.form.value.description);
    formData.append('price', String(this.form.value.price));
    formData.append('stock', String(this.form.value.stock));
    formData.append('size', this.form.value.size);
    formData.append('categoryId', String(this.form.value.categoryId));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    console.log('FormData preparada para envío:', {
      id: this.productId,
      name: this.form.value.name,
      description: this.form.value.description,
      price: this.form.value.price,
      stock: this.form.value.stock,
      size: this.form.value.size,
      categoryId: this.form.value.categoryId,
      image: this.selectedFile
    });
    this.productSvc.update(this.productId, formData).subscribe({
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
  
  getImageUrl(imagePath: string | undefined | null): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    console.log('Construyendo URL de imagen para:',environment.apiUrl, imagePath);
    return `${environment.apiUrl}/public/${imagePath}`;
  }

    
  showToast(message: string, kind: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastVariant = kind === 'success' ? 'success' : (kind === 'error' ? 'danger' : 'primary');
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3500);
  }

  hideToast() { this.toastVisible = false; }
}


