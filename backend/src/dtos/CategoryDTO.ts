import { Entity } from "typeorm";
import { Category } from "../Models/category.entity";

export class CategoryDTO {
    public id?: number
    public name?: string
    public description?: string
    constructor(

    ) { }

    static fromEntity(category: Category): CategoryDTO {
        const dto = new CategoryDTO()
        dto.id = category.id
        dto.name = category.name
        dto.description = category.description
        return dto
    }

    toEntity(): Category {
        const entity = new Category()
        Object.assign(entity, this)
        return entity
    }

    static createDTO(object: { [key: string]: any; }): CategoryDTO {
        const { id, name, description } = object; 
        const dto = new CategoryDTO()
        dto.id = id
        dto.name = name
        dto.description = description
        return dto
    }
}