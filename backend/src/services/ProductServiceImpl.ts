import { ObjectLiteral, ReturnDocument, Transaction } from "typeorm";
import { ProductDTO } from "../dtos/ProductDTO";
import { Product } from "../Models/product.entity";
import { ProductRepository } from "../repositories/ProductRepository";
import { HttpErrors } from "../utils/HttpErrors";
import { ProductService } from "./ProductService";
import { envs } from '../config/envs';
import { SchemaResponse } from "../config/SchemaResponse";

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
            // const metadata: Metadata = {}
            const result = await (await this.repo.findAllByPage(PPP * (page - 1), PPP)).map(e => ProductDTO.fromEntity(e))
            if (result.length === 0) throw HttpErrors.NotFound()
            const count = await this.repo.count()
            return new SchemaResponse(result, { count })
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
            const result = await this.repo.save(entity as unknown as Product)
            return new SchemaResponse(ProductDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updateMany(dtos: ProductDTO[]): Promise<SchemaResponse<ProductDTO[]>> {
        try {
            const products: Product[] = dtos.map(e => e.toEntity())
            // const entities = this.repo.preload(products)
            if (products.length === 0) throw HttpErrors.internalServerError("Something went wrong")
            const result = (await this.repo.saveMany(products)).map(e => ProductDTO.fromEntity(e))
            return new SchemaResponse(result)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //     try {
    //         const products: Product[] = dtos.map(e => e.toEntity())
    //         const fails: Product[] = []
    //         const success: Product[] = []
    //         for (const p of products) {
    //             try {
    //                 const entity = await this.repo.preload(p)
    //                 if (!entity) {
    //                     fails.push(p)
    //                     continue
    //                 }
    //                 const savedEntity = await this.repo.save(entity)
    //                 success.push(savedEntity)
    //             } catch (error) {
    //                 fails.push(p)
    //             }
    //         }
    //         const result = success.map(e => ProductDTO.fromEntity(e))
    //         const failures = fails.map(e => ProductDTO.fromEntity(e))
    //         return new SchemaResponse(result, { failures })
    //     } catch (error) {
    //         console.log(error);
    //         throw error
    //     }
    // }

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
            const result = (await this.repo.findByName(description)).map(e => ProductDTO.fromEntity(e))
            if (result.length === 0) throw HttpErrors.NotFound()
            const count = await this.repo.totalResultsByName(description)
            return new SchemaResponse(result, { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}