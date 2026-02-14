import { ProductDTO } from "../dtos/ProductDTO";
import { SchemaResponse } from '../config/SchemaResponse'

export interface ProductService {
    getAll(): Promise<SchemaResponse<ProductDTO[]>>
    getById(id: number): Promise<SchemaResponse<ProductDTO | null>>
    insert(dto: ProductDTO): Promise<SchemaResponse<ProductDTO>>
    update(dto: ProductDTO): Promise<SchemaResponse<ProductDTO>>
    updateMany(dtos: ProductDTO[]): Promise<SchemaResponse<ProductDTO[]>>
    getByName(name: string): Promise<SchemaResponse<ProductDTO[]>>
    getByDescription(description: string): Promise<SchemaResponse<ProductDTO[]>>
    getByCategoryName(categoryName: string): Promise<SchemaResponse<ProductDTO[]>>
    getAllPaginated(page: number): Promise<SchemaResponse<ProductDTO[]>>
    filterByStock(from: number, to: number, page: number): Promise<SchemaResponse<ProductDTO[]>>
    delete(id: number): Promise<SchemaResponse<ProductDTO>>
    listDisabled(page: number): Promise<SchemaResponse<ProductDTO[]>>
}
