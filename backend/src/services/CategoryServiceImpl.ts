import { CategoryDTO } from "../dtos/CategoryDTO";
import { Category } from "../Models/category.entity";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { HttpErrors } from "../utils/HttpErrors";
import { CategoryService } from "./CategoryService";
import {envs} from "../config/envs"
import { Metadata, SchemaResponse } from "../config/SchemaResponse";

const PPP = envs.PRODUCTS_PER_PAGE??4;

export class CategoryServiceImpl implements CategoryService {
    private readonly repo: CategoryRepository;
    constructor(repo: CategoryRepository) {
        this.repo = repo;
    }
    async getAllPaginated(page: number): Promise<SchemaResponse<CategoryDTO[]>> {
        try{
            const metadata: Metadata = {}
            const result = await (await this.repo.findAllByPage(PPP * (page - 1), PPP)).map(e => CategoryDTO.fromEntity(e))
            if (result.length === 0) throw HttpErrors.NotFound()
            metadata.count = await this.repo.count()
            return new SchemaResponse(result, metadata)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getAll(): Promise<SchemaResponse<CategoryDTO[]>> {
        try {
            const result = (await this.repo.findAll()).map(e => CategoryDTO.fromEntity(e))
            return new SchemaResponse(result)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getById(id: number): Promise<SchemaResponse<CategoryDTO | null>> {
        try {
            const result = await this.repo.findOneById(id)
            if (!result) throw HttpErrors.NotFound
            return new SchemaResponse(CategoryDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

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

    async update(dto: CategoryDTO): Promise<SchemaResponse<CategoryDTO>>{
        try{
            const category: Category = dto.toEntity()
            const entity = this.repo.preload(category)
            if(!entity) throw HttpErrors.internalServerError("Something went wrong")
            const result = await this.repo.save(category)
            return new SchemaResponse(CategoryDTO.fromEntity(result))
        } catch (error){
            console.log(error);
            throw error
        }
    }

    async findByName(name: string): Promise<SchemaResponse<CategoryDTO[]>> {
        try {
            /*const result = (await this.repo.findByName(name))?.map(e => CategoryDTO.fromEntity(e))
            if (result.length === 0) throw HttpErrors.NotFound()
            const count = await this.repo.totalResultsByName(name)
            return new SchemaResponse(result, { count })
            */
           //REVISAR ESTA CORRECCIÓN DE CHATI
           const entities = await this.repo.findByName(name);
           if(!entities || entities.length === 0){
            throw HttpErrors.NotFound()
           }
           const result = entities.map(e => CategoryDTO.fromEntity(e))
           const count = await this.repo.totalResultsByName(name)
           return new SchemaResponse (result, { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async findByDescription(description: string): Promise<SchemaResponse<CategoryDTO[]>> {
        try {
            /*const result = (await this.repo.findByDescription(description))?.map(e => CategoryDTO.fromEntity(e))
            if (result.length === 0) throw HttpErrors.NotFound()
            const count = await this.repo.totalResultsByName(description)
            return new SchemaResponse(result, {count})
            */
           const entities = await this.repo.findByDescription(description)
           if(!entities || entities.length === 0) {
            throw HttpErrors.NotFound()
           }
           const result = entities.map(e => CategoryDTO.fromEntity(e))
           const count = await this.repo.totalResultsByDescription(description)
           return new SchemaResponse( result, {count})
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}