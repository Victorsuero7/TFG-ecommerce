import { ObjectLiteral } from "typeorm";
import { ProductDTO } from "../dtos/ProductDTO";
import { Product } from "../Models/product.entity";
import { SchemaResponse } from '../config/SchemaResponse'

export interface ProductService {
    getAll(): Promise<SchemaResponse<ProductDTO[]>>
    getById(id: number): Promise<SchemaResponse<ProductDTO | null>>
    insert(dto: ProductDTO): Promise<SchemaResponse<ProductDTO>>
    update(dto: ProductDTO): Promise<SchemaResponse<ProductDTO>>
    getByName(name: string): Promise<SchemaResponse<ProductDTO[]>>
    getByDescription(description: string): Promise<SchemaResponse<ProductDTO[]>>
    getAllPaginated(page: number): Promise<SchemaResponse<ProductDTO[]>>
}
