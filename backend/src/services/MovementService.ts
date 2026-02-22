import { SchemaResponse } from "../config/SchemaResponse";
import { MovementDTO } from "../dtos/MovementDTO";
import { MovementDTO } from "../dtos/MovementDTO";

export interface MovementService {
    getAllPaginated(page?: number): Promise<SchemaResponse<MovementDTO[]>>
    getOne(id: any): Promise<SchemaResponse<MovementDTO | null>>
    getByQueryParams(params: { [key: string]: any; }): Promise<SchemaResponse<MovementDTO[]>>
    searchByProductName(name: string, page?: number): Promise<SchemaResponse<MovementDTO[]>>
}
