import { Between, DataSource, FindOptionsWhere, ILike } from "typeorm";
import { Product } from "../Models/product.entity";
import { TypeORMRepository } from "./TypeORMRepository";
import { Category } from "../Models/category.entity";

export class ProductRepository extends TypeORMRepository<Product, number> {
    constructor(datasource: DataSource) {
        super(Product, datasource)
    }
    async findAll(): Promise<Product[]> {
        return await this.repo.find({ relations: ['category', 'modifiedBy'] });
    }

    async findOneById(id: number): Promise<Product | null> {
        return await this.repo.findOne({
            where: { id },
            relations: ["category", 'modifiedBy']
        })
    }

    async findAllByPage(offset: number, limit: number): Promise<[Product[], number]> {
        return await this.repo.findAndCount({ where: { enable: true }, skip: offset, take: limit })
    }

    async findByCategory(category: Category, offset: number, limit: number): Promise<[Product[], number]> {
        return await this.repo.findAndCount({
            where: { category },
            order: {
                name: "ASC"
            },
            skip: offset,
            take: limit,
            relations: ['category', 'modifiedBy']
        })
    }

    async findByCategoryName(categoryName: string): Promise<Product[]> {
        return await this.repo.find({
            where: { category: { name: ILike(`%${categoryName}%`) } },
            relations: ['category', 'modifiedBy']
        })
    }

    async findByName(name: string): Promise<Product[]> {
        return await this.repo.find({ where: { name: ILike(`%${name}%`) }, relations: ['category', 'modifiedBy'] })
    }

    async findByDescription(description: string): Promise<Product[]> {
        return await this.repo.find({ where: { description: ILike(`%${description}%`) }, relations: ['category', 'modifiedBy'] })
    }

    async totalResults(): Promise<number> {
        return await this.repo.count({ where: { enable: true } })
    }

    async totalResultsByDescription(description: string): Promise<number> {
        return await this.repo.countBy({ description: ILike(`%${description}%`), enable: true })
    }

    async totalResultsByName(name: string): Promise<number> {
        return await this.repo.countBy({ name: ILike(`%${name}%`), enable: true })
    }

    async stockBetween(from: number, to: number, offset: number, limit: number): Promise<[Product[], number]> {
        return await this.repo.findAndCount({
            where: { stock: Between(from, to), enable: true },
            order: { stock: "DESC" },
            skip: offset,
            take: limit
        })
    }

    async getDisabled(offset: number, limit: number): Promise<[Product[], number]> {
        return await this.repo.findAndCount({
            where: {
                enable: false
            },
            order: {
                name: "ASC"
            },
            skip: offset,
            take: limit
        })
    }
}