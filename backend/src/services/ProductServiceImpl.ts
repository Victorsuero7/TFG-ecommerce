import { ObjectLiteral, ReturnDocument } from "typeorm";
import { ProductDTO } from "../dtos/ProductDTO";
import { Product } from "../Models/product.entity";
import { ProductRepository } from "../repositories/ProductRepository";
import { HttpErrors } from "../utils/HttpErrors";
import { ProductService } from "./ProductService";
import { envs } from '../config/envs';

const PPP = envs.PRODUCTS_PER_PAGE!

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

    async getAllPaginated(page: number): Promise<Product[]> {
        try {
            const result = await this.repo.findAllByPage(PPP * (page - 1), PPP)
            if (result.length === 0) throw HttpErrors.NotFound()
            return result
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
            const entity = await this.repo.merge(product)
            if (!entity) throw HttpErrors.NotFound("Product not found")
            const result = await this.repo.save(entity)
            return ProductDTO.fromEntity(result)

        } catch (error) {
            console.log(error);
            throw error
        }

    }

}