import { Movement } from "../Models/DataMovements.entity";
import { SchemaResponse } from "../config/SchemaResponse";

export interface MovementService {
    getAll(): Promise<SchemaResponse<Movement[]>>
}
