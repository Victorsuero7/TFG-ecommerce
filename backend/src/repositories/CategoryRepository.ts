import { DataSource, EntityTarget, ILike } from "typeorm";
import { Category } from "../Models/category.entity";
import { TypeORMRepository } from "./TypeORMRepository";

/**
 * Repositorio específico para las operaciones relacionadas con la
 * entidad Category.
 * 
 * Extiende de TypeORMRepository para reutilizar la funcionalidad básica de 
 * acceso a base de datos.
 */
export class CategoryRepository extends TypeORMRepository<Category, number> {
    
    /**
     * Constructor del repositorio.
     * @param datasource Conexión a la base de datos.
     */
    constructor(datasource: DataSource) {
        super(Category, datasource)
    }

    /**
     * Busca categorías cuya descripción contenga el texto indicado.
     * @param description Texto a buscar en la descripción.
     * @returns Devuelve una lista de categorías y el total.
     */
    async findByDescription(description: string): Promise<[Category[] , number]> {
        return await this.repo.findAndCountBy({ description: ILike(`%${description}%`) })
    }

    /**
     * Busca categorías cuyo nombre contenga el texto indicado.
     * @param name Texto a buscar en el nombre.
     * @returns Devuelve una lista de categorías encontradas y el total.
     */
    async findByName(name: string): Promise<[Category[], number]> {
        return await this.repo.findAndCountBy({ name: ILike(`%${name}%`) })
    }

    /**
     * Obtiene el número total de categorías.
     * @returns Devuelve el número total de categorías registradas.
     */
    async totalResults(): Promise<number>{
        return await this.repo.count()
    }

    /**
     * Cuenta cuántas categorías contienen el texto buscado.
     * @param description Texto a buscar.
     * @returns Devuelve el número total de resultados.
     */
    async totalResultsByDescription(description: string): Promise<number>{
        return await this.repo.countBy({ description: ILike(`%${description}`)})
    }

    /**
     * Cuenta cuántas categorías contiene el texto indicado en su nombre.
     * @param name Texto a buscar.
     * @returns Devuelve el número total de resultados.
     */
    async totalResultsByName(name: string): Promise<number> {
        return await this.repo.countBy({ name: ILike(`%${name}`)})
    }

    /**
     * Obtiene todas las categorías por paginación.
     * @param offset Número de registros a saltar.
     * @param limit Número máximo de registros.
     * @returns Devuelve una lista de categorías y el total.
     */
    async findAllByPage(offset: number, limit: number): Promise<[Category[], number]> {
        return await this.repo.findAndCount({ skip: offset, take: limit })
    }
}