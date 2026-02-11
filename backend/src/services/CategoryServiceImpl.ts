import { CategoryDTO } from "../dtos/CategoryDTO";
import { Category } from "../Models/category.entity";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { HttpErrors } from "../utils/HttpErrors";
import { CategoryService } from "./CategoryService";

export class CategoryServiceImpl implements CategoryService {
    private readonly repo: CategoryRepository;
    constructor(repo: CategoryRepository) {
        this.repo = repo;
    }

    async getAll(): Promise<Category[]> {
        try {
            return await this.repo.findAll()
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getById(id: number): Promise<Category | null> {
        try {
            const category = await this.repo.findOneById(id)
            if (!category) throw HttpErrors.NotFound
            return category
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async insert(dto: CategoryDTO): Promise<Category> {
        try {
            const category = new Category()
            category.name = dto.name
            category.description = dto.description
            return await this.repo.save(category)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async findByName(name: string): Promise<Category[] | null> {
        try {
            const result = await this.repo.findByName(name)
            if (!result) throw HttpErrors.NotFound()
            return result
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async findByDescription(description: string): Promise<Category[] | null> {
        try {
            const result = await this.repo.findByDescription(description)
            if (!result) throw HttpErrors.NotFound()
            return result
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}