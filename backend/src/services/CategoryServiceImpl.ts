import { Category } from "../Models/category.entity";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CategoryService } from "./CategoryService";

export class CategoryServiceImpl implements CategoryService{
    private readonly repo: CategoryRepository;
    constructor(repo: CategoryRepository){
        this.repo = repo;
    }
    async getAll(): Promise<Category[]> {
        return await this.repo.findAll()
    }
    async getOne(id: number): Promise<Category | null> {
        return await this.repo.findOneById(id)
    }
    async insert(category: Category): Promise<Category> {
        return await this.repo.save(category)
    }
    async findByName(name: string): Promise<Category | null>{
        return await this.repo.findByName(name)
    }
    async findByDescription(description: string): Promise<Category | null> {
        return await this.repo.findByDescription(description)
    }
}