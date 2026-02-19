import { Movement } from "../Models/DataMovements.entity";
import { MovementRepository } from "../repositories/MovementRepository";
import { MovementService } from "./MovementService";
import { SchemaResponse } from "../config/SchemaResponse";
import { envs } from "../config/envs";

const PPP = envs.PRODUCTS_PER_PAGE ?? 20;

export class MovementServiceImpl implements MovementService {
    private readonly repo: MovementRepository;
    constructor(repo: MovementRepository) {
        this.repo = repo;
    }

    async getAll(): Promise<SchemaResponse<Movement[]>> {
        try {
            const result = await this.repo.findAllWithRelations();
            return new SchemaResponse(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
