import { SchemaResponse } from "../config/SchemaResponse";
import { UserDTO } from "../dtos/UserDTO";
import { Movement } from "../Models/DataMovements.entity";

export interface MovementService {
    getAllPaginated(page?: number): Promise<SchemaResponse<Movement[]>>
    getOne(id: any): Promise<SchemaResponse<Movement | null>>
}
