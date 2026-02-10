import { ProductDTO } from "../dtos/ProductDTO";
import { Product } from "../Models/product.entity";

export interface ProductService {
    getAll(): Promise<Product[]>
    getById(id: number): Promise<Product | null>
    // insert(dto: ProductDTO): Promise<Product>
    insert(dto: ProductDTO): Promise<Response<Product>>
    getByName(name: string): Promise<Product[]>
    getByDescription(description: string): Promise<Product[]>
    getAllPaginated(page: number): Promise<Product[]>
}
type Response<T> = {
    result:T,
    metadata?:{[key:string]:any}
}