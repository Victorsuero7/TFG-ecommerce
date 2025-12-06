import { Category } from './category.model';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;   
  size: string;
  stock: number;
  category?: Category;
}