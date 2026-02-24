import { DataSource, EntityTarget, ILike } from "typeorm";
import { Category } from "../Models/category.entity";
import { TypeORMRepository } from "./TypeORMRepository";

export class CategoryRepository extends TypeORMRepository<Category, number> {
    constructor(datasource: DataSource) {
        super(Category, datasource)
    }

    async findByDescription(description: string): Promise<[Category[] , number]> {
        return await this.repo.findAndCountBy({ description: ILike(`%${description}%`) })
    }

    async findByName(name: string): Promise<[Category[], number]> {
        return await this.repo.findAndCountBy({ name: ILike(`%${name}%`) })
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

   async findAllByPage(offset: number, limit: number): Promise<[Category[], number]> {
        return await this.repo.findAndCount({ skip: offset, take: limit })
    }
}