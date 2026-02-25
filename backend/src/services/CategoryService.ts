import { SchemaResponse } from "../config/SchemaResponse";
import { CategoryDTO } from "../dtos/CategoryDTO";
import { Category } from "../Models/category.entity";

export interface CategoryService {
    getAll(): Promise<SchemaResponse<CategoryDTO[]>>
    getById(id: number): Promise<SchemaResponse<CategoryDTO | null>>
    insert(dto: CategoryDTO): Promise<SchemaResponse<CategoryDTO>>
    update(dto: CategoryDTO): Promise<SchemaResponse<CategoryDTO>>
    findByName(name: string): Promise<SchemaResponse<CategoryDTO[]>>
    findByDescription(description: string): Promise<SchemaResponse<CategoryDTO[]>>
    getAllPaginated(page: number): Promise<SchemaResponse<CategoryDTO[]>>
}
