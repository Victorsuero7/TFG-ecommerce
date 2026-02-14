import { DataSource, EntityTarget, ILike } from "typeorm";
import { Category } from "../Models/category.entity";
import { TypeORMRepository } from "./TypeORMRepository";

export class CategoryRepository extends TypeORMRepository<Category, number> {
    constructor(datasource: DataSource) {
        super(Category, datasource)
    }

    async findByDescription(description: string): Promise<Category[] | null> {
        return await this.repo.findBy({ description: ILike(`%${description}%`) })
    }

    async findByName(name: string): Promise<Category[] | null> {
        return await this.repo.findBy({ name: ILike(`%${name}%`) })
    }

    async totalResults(): Promise<number>{
        return await this.repo.count()
    }

    async totalResultsByDescription(description: string): Promise<number>{
        return await this.repo.countBy({ description: ILike(`%${description}`)})
    }

    async totalResultsByName(name: string): Promise<number> {
        return await this.repo.countBy({ name: ILike(`%${name}`)})
    }
}