import { DataSource, EntityTarget } from "typeorm";
import { Category } from "../Models/category.entity";
import { TypeORMRepository } from "./TypeORMRepository";

export class CategoryRepository extends TypeORMRepository <Category, number>{
    constructor(datasource: DataSource){
        super(Category, datasource)
    }

    async findByDescription(description: string): Promise<Category | null>{
        return await this.repo.findOneBy({ description})
    }  
}