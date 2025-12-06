import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from '../../services/generic/generic.service';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericService<Product> {
  constructor(http: HttpClient) {
    super(http, 'products'); 
  }
}
