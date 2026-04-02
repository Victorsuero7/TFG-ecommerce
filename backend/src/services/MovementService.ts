import { SchemaResponse } from "../config/SchemaResponse";
import { MovementDTO } from "../dtos/MovementDTO";

/**
 * Interfaz que define las operaciones disponibles para la gestión
 * de movimientos relacionados con los productos y usuarios.
 */
export interface MovementService {
    /** Obtiene todos los movimientos con paginación. */
    getAllPaginated(page?: number): Promise<SchemaResponse<MovementDTO[]>>
    /** Obtiene un movimiento por su identificador. */
    getOne(id: any): Promise<SchemaResponse<MovementDTO | null>>
    /** Obtiene un movimiento según los filtros. */
    getByQueryParams(params: { [key: string]: any; }): Promise<SchemaResponse<MovementDTO[]>>
}
