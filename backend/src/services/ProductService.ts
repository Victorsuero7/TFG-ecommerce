import { Product } from "../Models/product.entity";

export interface ProductService {
    getAll(): Promise<Product[]>
    getById(id: number): Promise<Product | null>
    insert(product: Product): Promise<Product>
}
