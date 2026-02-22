import { MovementService } from "./MovementService";
import { MovementRepository } from "../repositories/MovementsRepository";
import { envs } from "../config/envs";
import { SchemaResponse } from "../config/SchemaResponse";
import { MovementDTO } from "../dtos/MovementDTO";
import { HttpErrors } from "../utils/HttpErrors";
import { MovementDTO } from "../dtos/MovementDTO";
import { HttpErrors } from "../utils/HttpErrors";

const PPP = envs.PRODUCTS_PER_PAGE ?? 20

export class MovementServiceImpl implements MovementService {
    private readonly repo: MovementRepository;
    constructor(repo: MovementRepository) {
        this.repo = repo;
    }
    async getAllPaginated(page = 1): Promise<SchemaResponse<MovementDTO[]>> {
    async getAllPaginated(page = 1): Promise<SchemaResponse<MovementDTO[]>> {
        try {
            const [result, count] = await this.repo.findAllByPage(PPP * (page - 1), PPP)
            return new SchemaResponse(result.map(e => MovementDTO.fromEntity(e)), { count })
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getOne(id: any): Promise<SchemaResponse<MovementDTO | null>> {
        try {
            const result = await this.repo.findOneById(id)
            if (!result) throw HttpErrors.NotFound()
            return new SchemaResponse(MovementDTO.fromEntity(result))
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async searchByProductName(name: string, page = 1): Promise<SchemaResponse<MovementDTO[]>> {
        try {
            const [result, count] = await this.repo.findByProductName(name, PPP * (page - 1), PPP)
            return new SchemaResponse(result.map(e => MovementDTO.fromEntity(e)), { count })
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getByQueryParams(params: { [key: string]: any; }): Promise<SchemaResponse<MovementDTO[]>> {
        try {
            const [result, count] = await this.repo.findByConditions({ userId: params.user, from: params.from, to: params.to, productId: params.product }, PPP * (params.page - 1), PPP)
            // const [result, count] = await this.repo.findByConditions({ from: "", to: "2026-02-19" }, PPP * (params.page - 1), PPP)

            if (result.length === 0) throw HttpErrors.NotFound()
            return new SchemaResponse(result.map(e => MovementDTO.fromEntity(e)), { count })
        } catch (error) {
            console.log(error)
            throw error
        }
    }


}