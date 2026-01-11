import { Category } from "../Models/category.entity";

export interface CategoryService {
    getAll(): Promise<Category[]>
    getById(id: number): Promise<Category | null>
    insert(category: Category): Promise<Category>
    findByName(name: string): Promise<Category | null>
    findByDescription(description: string): Promise<Category | null>
}