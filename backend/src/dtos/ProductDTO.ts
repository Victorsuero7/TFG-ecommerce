import { Product } from "../Models/product.entity";
import { Category } from "../Models/category.entity";

export class ProductDTO {
    public id?: number
    public name?: string
    public description?: string
    public price?: number
    public size?: string
    public stock?: number
    public imageUrl?: string | undefined
    public category?: Category
    constructor(

    ) { }

    static fromEntity(product: Product): ProductDTO {
        const dto = new ProductDTO()
        dto.id = product.id
        dto.name = product.name
        dto.description = product.description
        dto.price = product.price
        dto.size = product.size
        dto.stock = product.stock
        dto.imageUrl = product.imageUrl
        dto.category = product.category
        return dto
    }

    public toEntity(): Product {
        const entity = new Product()
        Object.assign(entity, this)
        return entity
    }

    static createDTO(object: { [key: string]: any }, path?: string | undefined): ProductDTO {
        const { id, name, description, price, size, stock, categoryId } = object;
        const dto = new ProductDTO()
        dto.id = id
        dto.name = name
        dto.description = description
        dto.price = price
        dto.size = size
        dto.stock = stock
        dto.category = categoryId
        dto.imageUrl = path
        return dto
    }
}