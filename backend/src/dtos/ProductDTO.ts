import { Product } from "../Models/product.entity";

export class ProductDTO {

    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly size: string,
        public readonly stock: number
    ) { }

    static fromEntity(product: Product): ProductDTO {
        return new ProductDTO(product.name, product.description, product.price, product.size, product.stock)
    }

    public toEntity(): Product {
        const entity = new Product()
        Object.assign(entity, this)
        return entity
    }

    static createDTO(object: { [key: string]: any; }): ProductDTO {
        const { name, description, price, size, stock } = object;
        return new ProductDTO(name, description, price, size, stock)
    }

}