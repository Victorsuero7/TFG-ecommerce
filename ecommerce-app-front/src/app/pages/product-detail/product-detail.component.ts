import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  loading = false;
  error = '';
  imageError = false;
  imageUrl: string | ArrayBuffer | null = null;
  uploading = false;
  selectedFile: File | null = null;

  constructor(private route: ActivatedRoute, private productSvc: ProductService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.productSvc.getById(id).subscribe({
        next: (prod) => {
          console.log('Respuesta getById:', prod);
          const p = (prod as any).result ?? prod;
          this.product = p;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el producto';
          this.loading = false;
          console.error('Error getById:', err);
        }
      });
    }
  }
}
