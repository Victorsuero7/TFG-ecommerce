import { CategoryDTO } from "../dtos/CategoryDTO";
import { Category } from "../Models/category.entity";

export interface CategoryService {
    getAll(): Promise<Category[]>
    getById(id: number): Promise<Category | null>
    insert(dto: CategoryDTO): Promise<Category>
    findByName(name: string): Promise<Category[] | null>
    findByDescription(description: string): Promise<Category[] | null>
    getAllPaginated(page: number): Promise<Category[]>
}
