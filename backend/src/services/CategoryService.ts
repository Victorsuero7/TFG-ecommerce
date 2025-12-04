import { Category } from "../Models/category.entity";

export interface CategoryService {
    gettAll(): Promise<Category[]>
    getOne(id: number): Promise<Category | null>
    insert(category: Category): Promise<Category>
    findByName(name: string): Promise<Category | null>
    findByDescription(description: string): Promise<Category | null>
}