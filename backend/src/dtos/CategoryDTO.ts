import { Category } from "../Models/category.entity";

export class CategoryDTO {
    constructor(
        public readonly id: number | null,
        public readonly name: string,
        public readonly description: string
    ) { }

    static fromEntity(category: Category): CategoryDTO {
        return new CategoryDTO(category.id, category.name, category.description)
    }

    public toEntity(): Category {
        const entity = new Category ()
        Object.assign(entity, this)
        return entity
    }

    static createDTO(object: { [key: string]: any; }): CategoryDTO {
        const { name, description } = object;
        return new CategoryDTO(0, name, description)
    }
}