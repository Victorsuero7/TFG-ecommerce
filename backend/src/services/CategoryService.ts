import { SchemaResponse } from "../config/SchemaResponse";
import { CategoryDTO } from "../dtos/CategoryDTO";
import { Category } from "../Models/category.entity";

/**
 * Interfaz que define las operaciones disponibles para la 
 * gestión de categorías.
 */
export interface CategoryService {
    /** Obtiene todas las categorías. */
    getAll(): Promise<SchemaResponse<CategoryDTO[]>>
    /** Obtiene una categoría por su identificador. */
    getById(id: number): Promise<SchemaResponse<CategoryDTO | null>>
    /** Inserta una nueva categoría. */
    insert(dto: CategoryDTO): Promise<SchemaResponse<CategoryDTO>>
    /** Actualiza una nueva categoría. */
    update(dto: CategoryDTO): Promise<SchemaResponse<CategoryDTO>>
    /** Obtiene una categoría por su nombre. */
    findByName(name: string): Promise<SchemaResponse<CategoryDTO[]>>
    /** Obtiene una categoría por su descripción. */
    findByDescription(description: string): Promise<SchemaResponse<CategoryDTO[]>>
    /** Obtiene todas las categorías con paginación. */
    getAllPaginated(page: number): Promise<SchemaResponse<CategoryDTO[]>>
    delete(id: number): Promise<SchemaResponse<CategoryDTO>>

}
