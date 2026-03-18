import { CategoryDTO } from "../dtos/CategoryDTO";
import { Category } from "../Models/category.entity";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { HttpErrors } from "../utils/HttpErrors";
import { CategoryService } from "./CategoryService";
import { envs } from "../config/envs"
import { Metadata, SchemaResponse } from "../config/SchemaResponse";
import { ObjectLiteral, ReturnDocument, Transaction } from "typeorm";

const PPP = envs.PRODUCTS_PER_PAGE ?? 20;

/**
 * Implementación del servicio de categorías.
 * 
 * Contiene la lógica de negocio relacionada con la gestión de las 
 * categorías de los productos.
 */
export class CategoryServiceImpl implements CategoryService {
    private readonly repo: CategoryRepository;

    /**
     * Constructor del repositorio.
     * @param repo Repositorio de categorías.
     */
    constructor(repo: CategoryRepository) {
        this.repo = repo;
    }

    /**
     * Obtiene todas las categorías usando paginación.
     * @param page Página a consultar.
     * @returns Devuelve una lista CategoryDTO.
     */
    async getAllPaginated(page: number): Promise<SchemaResponse<CategoryDTO[]>> {
        try {
            // const metadata: Metadata = {}
            const [result, count] = await this.repo.findAllByPage(PPP * (page - 1), PPP)
            if (result.length === 0) throw HttpErrors.NotFound()
            return new SchemaResponse(result.map(e => CategoryDTO.fromEntity(e)), { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Obtiene todas las categorías.
     * @returns Devuelve una lista de CategoryDTO.
     */
    async getAll(): Promise<SchemaResponse<CategoryDTO[]>> {
        try {
            const result = (await this.repo.findAll()).map(e => CategoryDTO.fromEntity(e))
            return new SchemaResponse(result)
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una categoría por su identificador.
     * @param id Identificador único de la categoría.
     * @returns Devuelve un CategoryDTO o null.
     */
    async getById(id: number): Promise<SchemaResponse<CategoryDTO | null>> {
        try {
            const result = await this.repo.findOneById(id)
            if (!result) throw HttpErrors.NotFound()
            return new SchemaResponse(CategoryDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Inserta una nueva categoría en la base de datos.
     * @param dto CategoryDTO a guardar.
     * @returns Devuelve la categoría guardada.
     */
    async insert(dto: CategoryDTO): Promise <SchemaResponse<CategoryDTO>> {
        try {
            const category: Category = dto.toEntity()
            const result = await this.repo.save(category)
            return new SchemaResponse(CategoryDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Actualiza una categoría.
     * @param dto CategoryDTO a actualizar.
     * @returns Devuelve la categoría actualizada.
     */
    async update(dto: CategoryDTO): Promise<SchemaResponse<CategoryDTO>>{
        try{
            const category: Category = dto.toEntity()
            const entity = this.repo.preload(category)
            if (!entity) throw HttpErrors.internalServerError("Something went wrong")
            const result = await this.repo.save(category)
            if (!result) throw HttpErrors.internalServerError("Something went wrong")
            return new SchemaResponse(CategoryDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Obtiene categorías por nombre.
     * @param name Nombre de la CategoryDTO.
     * @returns Devuelve un array de CategoryDTO.
     */
    async findByName(name: string): Promise<SchemaResponse<CategoryDTO[]>> {
        try {
            const [entities, count] = await this.repo.findByName(name)
            if (entities.length === 0) throw HttpErrors.NotFound()
            const result = entities.map(e => CategoryDTO.fromEntity(e))
            return new SchemaResponse(result, { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Obtiene categorías por descripción.
     * @param description Texto de la descripción de la categoría.
     * @returns Devuelve un array de CategoryDTO.
     */
    async findByDescription(description: string): Promise<SchemaResponse<CategoryDTO[]>> {
        try {
            const [entities, count] = await this.repo.findByDescription(description)
            if (entities.length === 0) throw HttpErrors.NotFound()
            const result = entities.map(e => CategoryDTO.fromEntity(e))

            return new SchemaResponse(result, { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async delete(id: number): Promise<SchemaResponse<CategoryDTO>> {
        try {
            const entity = await this.repo.findOneById(id)
            if (!entity) throw HttpErrors.NotFound()
            const result = await this.repo.remove(entity)
            if (!result) throw HttpErrors.internalServerError()
            return new SchemaResponse(CategoryDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}