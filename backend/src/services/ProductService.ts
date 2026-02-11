import { ProductDTO } from "../dtos/ProductDTO";
import { Product } from "../Models/product.entity";

export interface ProductService {
    getAll(): Promise<Product[]>
    getById(id: number): Promise<Product | null>
    insert(dto: ProductDTO): Promise<Product>
    update(id: number, dto: any): Promise<Product>
    getByName(name: string): Promise<Product[]>
    getByDescription(description: string): Promise<Product[]>
}
