import { ProductDTO } from "../dtos/ProductDTO";
import { Product } from "../Models/product.entity";
import { ProductRepository } from "../repositories/ProductRepository";
import { HttpErrors } from "../utils/HttpErrors";
import { ProductService } from "./ProductService";
import { Category } from "../Models/category.entity";

export class ProductServiceImpl implements ProductService {
    private readonly repo: ProductRepository;
    constructor(repo: ProductRepository) {
        this.repo = repo;
    }
    async getAll(): Promise<Product[]> {
        try {
            return await this.repo.findAll()
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async getById(id: number): Promise<Product | null> {
        try {
            const result = await this.repo.findOneById(id)
            if (!result) throw HttpErrors.NotFound()
            return result
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async insert(dto: ProductDTO): Promise<Product> {
        try {
            const product: Product = dto.toEntity()
            return await this.repo.save(product)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async getByName(name: string): Promise<Product[]> {
        try {
            return this.repo.findByName(name)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getByDescription(description: string): Promise<Product[]> {
        try {
            return this.repo.findByDescription(description)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async update(id: number, dto: any): Promise<Product> {
        try {
            const existing = await this.repo.findOneById(id)
            if (!existing) throw HttpErrors.NotFound()

            const { name, description, price, size, stock, category } = dto
            if (name !== undefined) existing.name = name
            if (description !== undefined) existing.description = description
            if (price !== undefined) existing.price = price
            if (size !== undefined) existing.size = size
            if (stock !== undefined) existing.stock = stock
            if (category && category.id) {
                const cat = new Category()
                cat.id = Number(category.id)
                existing.category = cat
            }

            return await this.repo.save(existing)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}