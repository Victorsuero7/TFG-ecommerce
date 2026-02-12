import { ObjectLiteral, ReturnDocument } from "typeorm";
import { ProductDTO } from "../dtos/ProductDTO";
import { Product } from "../Models/product.entity";
import { ProductRepository } from "../repositories/ProductRepository";
import { HttpErrors } from "../utils/HttpErrors";
import { ProductService } from "./ProductService";
import { Category } from "../Models/category.entity";
import { envs } from '../config/envs';
import { Metadata, SchemaResponse } from "../config/SchemaResponse";

const PPP = envs.PRODUCTS_PER_PAGE ?? 20

export class ProductServiceImpl implements ProductService {
    private readonly repo: ProductRepository;
    constructor(repo: ProductRepository) {
        this.repo = repo;
    }
    async getAll(): Promise<SchemaResponse<ProductDTO[]>> {
        try {
            const result = (await this.repo.findAll()).map(e => ProductDTO.fromEntity(e))
            return new SchemaResponse(result)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getAllPaginated(page: number): Promise<SchemaResponse<ProductDTO[]>> {
        try {
            const metadata: Metadata = {}
            const result = await (await this.repo.findAllByPage(PPP * (page - 1), PPP)).map(e => ProductDTO.fromEntity(e))
            if (result.length === 0) throw HttpErrors.NotFound()
            metadata.count = await this.repo.count()
            return new SchemaResponse(result, metadata)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getById(id: number): Promise<SchemaResponse<ProductDTO | null>> {
        try {
            const result = await this.repo.findOneById(id)
            if (!result) throw HttpErrors.NotFound()
            return new SchemaResponse(ProductDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async insert(dto: ProductDTO): Promise<SchemaResponse<ProductDTO>> {
        try {
            const product: Product = dto.toEntity()
            const result = await this.repo.save(product)
            return new SchemaResponse(ProductDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async update(dto: ProductDTO): Promise<SchemaResponse<ProductDTO>> {
        try {
            const product: Product = dto.toEntity()
            const entity = this.repo.preload(product)
            if (!entity) throw HttpErrors.internalServerError("Something went wrong")
            const result = await this.repo.save(product)
            return new SchemaResponse(ProductDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getByName(name: string): Promise<SchemaResponse<ProductDTO[]>> {
        try {
            const result = (await this.repo.findByName(name)).map(e => ProductDTO.fromEntity(e))
            if (result.length === 0) throw HttpErrors.NotFound()
            const count = await this.repo.totalResultsByName(name)
            return new SchemaResponse(result, { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getByDescription(description: string): Promise<SchemaResponse<ProductDTO[]>> {
        try {
            const result = (await this.repo.findByDescription(description)).map(e => ProductDTO.fromEntity(e))
            if (result.length === 0) throw HttpErrors.NotFound()
            const count = await this.repo.totalResultsByDescription(description)
            return new SchemaResponse(result, { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getByCategoryName(categoryName: string): Promise<SchemaResponse<ProductDTO[]>> {
        try {
            const result = (await this.repo.findByCategoryName(categoryName)).map(e => ProductDTO.fromEntity(e))
            if (result.length === 0) throw HttpErrors.NotFound()
            return new SchemaResponse(result, { count: result.length })
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async filterByStock(from: number, to: number, page: number): Promise<SchemaResponse<ProductDTO[]>> {
        try {
            const [result, count] = await this.repo.stockBetween(from, to, PPP * (page - 1), PPP)
            return new SchemaResponse(result.map(e => ProductDTO.fromEntity(e)), { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}