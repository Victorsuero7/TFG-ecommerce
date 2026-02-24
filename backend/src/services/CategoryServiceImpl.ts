import { CategoryDTO } from "../dtos/CategoryDTO";
import { Category } from "../Models/category.entity";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { HttpErrors } from "../utils/HttpErrors";
import { CategoryService } from "./CategoryService";
import {envs} from "../config/envs"
import { Metadata, SchemaResponse } from "../config/SchemaResponse";
import { ObjectLiteral, ReturnDocument, Transaction } from "typeorm";

const PPP = envs.PRODUCTS_PER_PAGE ?? 4;

export class CategoryServiceImpl implements CategoryService {
    private readonly repo: CategoryRepository;
    constructor(repo: CategoryRepository) {
        this.repo = repo;
    }
    async getAllPaginated(page: number): Promise<SchemaResponse<CategoryDTO[]>> {
        try{
           // const metadata: Metadata = {}
            const [result, count] = await this.repo.findAllByPage(PPP * (page - 1), PPP)
            if (result.length === 0) throw HttpErrors.NotFound()
            return new SchemaResponse(result.map(e => CategoryDTO.fromEntity(e)), { count })
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
           const [entities, count]= await this.repo.findByName(name)
           if (entities.length === 0) throw HttpErrors.NotFound()
           const result = entities.map(e => CategoryDTO.fromEntity(e))
           return new SchemaResponse (result, { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async findByDescription(description: string): Promise<SchemaResponse<CategoryDTO[]>> {
        try {
           const [entities, count] = await this.repo.findByDescription(description)
           if (entities.length === 0) throw HttpErrors.NotFound()
           const result = entities.map(e => CategoryDTO.fromEntity(e))
           
           return new SchemaResponse( result, {count})
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}