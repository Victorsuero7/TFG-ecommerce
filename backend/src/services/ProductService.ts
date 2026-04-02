import { ProductDTO } from "../dtos/ProductDTO";
import { SchemaResponse } from '../config/SchemaResponse'
import { CategoryDTO } from "../dtos/CategoryDTO";

/**
 * Interfaz que define las operaciones disponibles para la gestión
 * de productos en la aplicación.
 */
export interface ProductService {

    /** Obtiene todos los productos. */
    getAll(): Promise<SchemaResponse<ProductDTO[]>>
    /** Obtiene un producto por su identificador. */
    getById(id: number): Promise<SchemaResponse<ProductDTO | null>>
    /** Inserta un nuevo producto. */
    insert(dto: ProductDTO): Promise<SchemaResponse<ProductDTO>>
    /** Actualiza un producto. */
    update(dto: ProductDTO): Promise<SchemaResponse<ProductDTO>>
    /** Actualiza varios productos. */
    updateMany(dtos: ProductDTO[]): Promise<SchemaResponse<ProductDTO[]>>
    /** Obtiene un producto o productos por nombre. */
    getByName(name: string): Promise<SchemaResponse<ProductDTO[]>>
    /** Obtiene un producto o productos por descripción. */
    getByDescription(description: string): Promise<SchemaResponse<ProductDTO[]>>
    /** Obtiene un producto o productos por nombre de categoría. */
    getByCategoryName(categoryName: string): Promise<SchemaResponse<ProductDTO[]>>
    /** Obtiene todos los productos con paginación. */
    getAllPaginated(page: number): Promise<SchemaResponse<ProductDTO[]>>
    /** Obtiene los productos con un stock dentro del rango con paginación. */
    filterByStock(from: number, to: number, page: number): Promise<SchemaResponse<ProductDTO[]>>
    /** Deshabilita un produucto. */
    delete(id: number): Promise<SchemaResponse<ProductDTO>>
    /** Muestra una lista de productos deshabilitados con paginación. */
    listDisabled(page: number): Promise<SchemaResponse<ProductDTO[]>>
    /** Obtiene un producto o productos por categoría. */
    findByCategory(dto: CategoryDTO, page: number): Promise<SchemaResponse<ProductDTO[]>>;
}
