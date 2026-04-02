import { Movement } from "../Models/DataMovements.entity";
import { ProductDTO } from "./ProductDTO";
import { UserDTO } from "./UserDTO";

/**
 * DTO que representa un movimiento/cambio de stock.
 * 
 * Un movimiento registra cambios en el stock del producto, indicando quién
 * lo modificó y la fecha.
 */
export class MovementDTO {

    /**
     * Crea una instancia de MovementDTO.
     * 
     * @param id Identificador del movimiento.
     * @param product Producto asociado al movimiento.
     * @param finalStock Stock resultado del movimiento.
     * @param lastModification Fecha de la modificación.
     * @param modifiedBy Usuario que realizó la modificación.
     */
    constructor(
        public id: number,
        public product: ProductDTO,
        public finalStock: number,
        public lastModification: Date,
        public modifiedBy: UserDTO
    ) { }

    /**
     * Convierte una entidad Movement en MovementDTO.
     * 
     * @param mv Entidad Movement obtenida de la base de datos.
     * @returns Devuelve un MovementDTO.
     */
    static fromEntity(mv: Movement): MovementDTO {
        return new MovementDTO(
            mv.id,
            ProductDTO.fromEntity(mv.product),
            mv.finalStock,
            mv.lastModification,
            UserDTO.fromEntity(mv.modifiedBy)
        )
    }

    /**
     * Convierte un DTO en una entidad Movement.
     * 
     * @returns Devuelve un Movement.
     */
    toEntity(): Movement {
        const user = new Movement()
        Object.assign(user, this)
        return user
    }

    // static createDTO(object: { [key: string]: any; }): MovementDTO {
    //     const { name, lastName, email, phoneNumber,  } = object;
    //     return new MovementDTO(name, lastName, email, phoneNumber)
    // }
}