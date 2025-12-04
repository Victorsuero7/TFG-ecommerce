import { Product } from "../Models/product.entity";
import { ProductRepository } from "../repositories/ProductRepository";
import { ProductService } from "./ProductService";

export class ProductServiceImpl implements ProductService {
    private readonly repo: ProductRepository;
    constructor(repo: ProductRepository) {
        this.repo = repo;
    }
    async getAll(): Promise<Product[]> {
        return await this.repo.findAll()
    }
    async getById(id: number): Promise<Product | null> {
        return await this.repo.findOneById(id)
    }
    async insert(product: Product): Promise<Product> {
        return await this.repo.save(product)
    }

}