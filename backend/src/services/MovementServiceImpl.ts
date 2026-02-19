import { MovementService } from "./MovementService";
import { Movement } from "../Models/DataMovements.entity";
import { MovementRepository } from "../repositories/MovementsRepository";
import { envs } from "../config/envs";
import { SchemaResponse } from "../config/SchemaResponse";

const PPP = envs.PRODUCTS_PER_PAGE ?? 20

export class MovementServiceImpl implements MovementService {
    private readonly repo: MovementRepository;
    constructor(repo: MovementRepository) {
        this.repo = repo;
    }
    async getAllPaginated(page=1): Promise<SchemaResponse<Movement[]>> {
        try {
            const [result, count] = await this.repo.findAllByPage(page,PPP)

            return new SchemaResponse(result, {count})
        } catch (error) {
            console.log(error)
            throw error

        }
    }
    getOne(id: any):  Promise<SchemaResponse<Movement | null>> {
        throw new Error("Method not implemented.");
    }


}