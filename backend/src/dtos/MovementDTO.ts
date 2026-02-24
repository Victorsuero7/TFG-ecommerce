import { Movement } from "../Models/DataMovements.entity";
import { ProductDTO } from "./ProductDTO";
import { UserDTO } from "./UserDTO";

export class MovementDTO {
    constructor(
        public id: number,
        public product: ProductDTO,
        public lastModification: Date,
        public modifiedBy: UserDTO

    ) { }

    static fromEntity(mv: Movement): MovementDTO {
        return new MovementDTO(
            mv.id,
            ProductDTO.fromEntity(mv.product),
            mv.lastModification,
            UserDTO.fromEntity(mv.modifiedBy)
        )
    }

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