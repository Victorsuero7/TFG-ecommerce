import { MovementService } from "./MovementService";
import { MovementRepository } from "../repositories/MovementRepository";
import { envs } from "../config/envs";
import { SchemaResponse } from "../config/SchemaResponse";
import { MovementDTO } from "../dtos/MovementDTO";
import { HttpErrors } from "../utils/HttpErrors";

const PPP = envs.PRODUCTS_PER_PAGE ?? 20

/**
 * Implementación del servicio de movimientos.
 * 
 * Contiene la lógica de negocio relacionada con el control
 * de movimientos de productos por usuarios.
 */
export class MovementServiceImpl implements MovementService {
    private readonly repo: MovementRepository;

    /**
     * Constructor del repositorio.
     * @param repo Repositorio de movimientos.
     */
    constructor(repo: MovementRepository) {
        this.repo = repo;
    }

    /**
     * Obtiene todos los movimientos con paginación.
     * @param page Página a consultar.
     * @returns Devuelve un array de MovementDTO.
     */
    async getAllPaginated(page = 1): Promise<SchemaResponse<MovementDTO[]>> {
        try {
            const [result, count] = await this.repo.findAllByPage(PPP * (page - 1), PPP)
            return new SchemaResponse(result.map(e => MovementDTO.fromEntity(e)), { count })
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    /**
     * Obtiene un movimiento por su identificador.
     * @param id Identificador del movimiento.
     * @returns Devuelve un movimiento o null.
     */
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

    /**
     * Obtiene todos los movimientos según filtros.
     * @param params Filtros de búsqueda.
     * @returns Devuelve un array de movimientos.
     */
    async getByQueryParams(params: { [key: string]: any; }): Promise<SchemaResponse<MovementDTO[]>> {
        try {
            // console.log(params);
            const [result, count] = await this.repo.findByConditions(params, PPP * (params.page - 1), PPP)
            // const [result, count] = await this.repo.findByConditions({ from: "", to: "2026-02-19" }, PPP * (params.page - 1), PPP)

            if (result.length === 0) throw HttpErrors.NotFound()
            return new SchemaResponse(result.map(e => MovementDTO.fromEntity(e)), { count })
        } catch (error) {
            console.log(error)
            throw error
        }
    }


}