import { Category } from "../Models/category.entity";

export class CategoryDTO {
    constructor(
        public readonly name: string,
        public readonly description: string
    ) { }

    static fromEntity(category: Category): CategoryDTO {
        return new CategoryDTO(category.name, category.description)
    }

    static createDTO(object: { [key: string]: any; }): CategoryDTO {
        const { name, description } = object;
        return new CategoryDTO(name, description)
    }
}