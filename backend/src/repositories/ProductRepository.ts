import { DataSource, ILike } from "typeorm";
import { Product } from "../Models/product.entity";
import { TypeORMRepository } from "./TypeORMRepository";
import { Category } from "../Models/category.entity";

export class ProductRepository extends TypeORMRepository<Product, number> {
    constructor(datasource: DataSource) {
        super(Product, datasource)
    }
    async findAll(): Promise<Product[]> {
        return await this.repo.find({ relations: ['category'] });
    }

    async findOneById(id: number): Promise<Product | null> {
        return await this.repo.findOne({ where: { id }, relations: ['category'] });
    }

    async findByCategory(category: Category): Promise<Product[]> {
        return await this.repo.findBy({ category })
    }

    async findByName(name: string): Promise<Product[]> {
        return await this.repo.findBy({ name: ILike(`%${name}%`) })
    }

    async findByDescription(description: string): Promise<Product[]> {
        return await this.repo.findBy({ description: ILike(`%${description}%`) })
    }

    async totalResults(): Promise<number> {
        return await this.repo.count()
    }

    async totalResultsByDescription(description: string): Promise<number> {
        return await this.repo.countBy({ description: ILike(`%${description}%`) })
    }

    async totalResultsByName(name: string): Promise<number> {
        return await this.repo.countBy({ name: ILike(`%${name}%`) })
    }
}