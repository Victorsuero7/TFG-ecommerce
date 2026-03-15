import { Entity } from "typeorm";
import { Category } from "../Models/category.entity";

/**
 * DTO para la entidad Category.
 */
export class CategoryDTO {

    /** Identificador único de la categoría. */
    public id?: number
    /** Nombre de la categoría. */
    public name?: string
    /** Descripción de la categoría. */
    public description?: string
    constructor(

    ) { }

    /**
     * Convierte una entidad Category en CategoryDTO.
     * 
     * @param category Entidad category. 
     * @returns Devuelve un CategoryDTO.
     */
    static fromEntity(category: Category): CategoryDTO {
        const dto = new CategoryDTO()
        dto.id = category.id
        dto.name = category.name
        dto.description = category.description
        return dto
    }

    /**
     * Convierte un CategoryDTO en una entidad Category.
     * @returns Devuelve una entidad Category.
     */
    toEntity(): Category {
        const entity = new Category()
        Object.assign(entity, this)
        return entity
    }

    /**
     * Crea un CategoryDTO a partir de un objeto genérico.
     * 
     * @param object Objeto con datos de la categoría. 
     * @returns Devuelve un CategoryDTO.
     */
    static createDTO(object: { [key: string]: any; }): CategoryDTO {
        const { id, name, description } = object; 
        const dto = new CategoryDTO()
        dto.id = id
        dto.name = name
        dto.description = description
        return dto
    }
}