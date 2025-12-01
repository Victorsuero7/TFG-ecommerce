import { DataSource, EntityTarget } from "typeorm";
import { Product } from "../Models/product.entity";
import { TypeORMRepository } from "./TypeORMRepository";
import { Category } from "../Models/category.entity";

export class ProductRepository extends TypeORMRepository <Product, number>{
    constructor(datasource: DataSource){
        super(Product, datasource)
    }

    async findByCategory(category: Category): Promise<Product[]> {
        return await this.repo.findBy({ category})
    }
}