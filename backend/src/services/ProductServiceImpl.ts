import { ObjectLiteral } from "typeorm";
import { ProductDTO } from "../dtos/ProductDTO";
import { Product } from "../Models/product.entity";
import { ProductRepository } from "../repositories/ProductRepository";
import { HttpErrors } from "../utils/HttpErrors";
import { ProductService } from "./ProductService";

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

    async update(dto: ProductDTO): Promise<ProductDTO> {
        try {
            const product = dto.toEntity()
            const rows = (await this.repo.update(product.id, product)).affected
            if (!rows || rows === 0) throw HttpErrors.internalServerError()
            return await this.repo.findOneById(product.id)
        } catch (error) {
            console.log(error);
            throw error
        }

    }

}