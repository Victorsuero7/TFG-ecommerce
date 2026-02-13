import { Product } from "../Models/product.entity";
import { Category } from "../Models/category.entity";

export class ProductDTO {

    constructor(
        public id: number,
        public name: string,
        public description: string,
        public price: number,
        public size: string,
        public stock: number,
        public imageUrl: string | undefined,
        public category: Category
    ) { }

    static fromEntity(product: Product): ProductDTO {
        return new ProductDTO(product.id, product.name, product.description, product.price, product.size, product.stock, product.imageUrl, product.category)
    }

    public toEntity(): Product {
        const entity = new Product()
        Object.assign(entity, this)
        return entity
    }

    static createDTO(object: { [key: string]: any }, path?: string | undefined): ProductDTO {
        const { id, name, description, price, size, stock, categoryId } = object;
        return new ProductDTO(id, name, description, price, size, stock, path, categoryId)
    }
}