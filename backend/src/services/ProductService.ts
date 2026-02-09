import { ObjectLiteral } from "typeorm";
import { ProductDTO } from "../dtos/ProductDTO";
import { Product } from "../Models/product.entity";

export interface ProductService {
    getAll(): Promise<Product[]>
    getById(id: number): Promise<Product | null>
    insert(dto: ProductDTO): Promise<Product>
    getByName(name: string): Promise<Product[]>
    getByDescription(description: string): Promise<Product[]>
    update(dto: ProductDTO): Promise<number | undefined>
}
