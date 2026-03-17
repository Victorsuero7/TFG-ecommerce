import { asyncWrapProviders } from "async_hooks";
import { Repository, DataSource, EntityTarget, ObjectLiteral, FindOptionsWhere, UpdateResult } from "typeorm";

/**
 * Repositorio genérico basado en TypeORM.
 * 
 * Esta clase abstracta implementa operaciones CRUD básicas para 
 * cualquier entidad de la aplicación.
 * 
 * Los repositorios UserRepository y ProductRepository heredan de 
 * esta clase para reutilizar la lógica básica de acceso a la base 
 * de datos.
 * 
 * @typeParam T Tipo de entidad gestionada por el repositorio.
 * @typeParam ID Tipo del identificador de la entidad.
 */
export abstract class TypeORMRepository<T extends ObjectLiteral, ID> {
    
    /** Repositorio interno de TypeORM. */
    protected repo: Repository<T>;

    /**
     * Constructor del repositorio genérico.
     * 
     * @param entity Entidad gestionada por el repositorio.
     * @param datasource Fuente de datos de TypeORM.
     */
    constructor(
        entity: EntityTarget<T>,
        public readonly datasource: DataSource
    ) {
        this.repo = datasource.getRepository(entity);
    }

    /**
     * Obtiene todas las entidades.
     * @returns Devuelva una lista de todas las entidades.
     */
    async findAll(): Promise<T[]> {
        return await this.repo.find();
    }

    // async findAllByPage(offset: number, limit: number): Promise<T[]> {
    //     return await this.repo.find({ skip: offset, take: limit })
    // }

    /**
     * Busca una entidad por su identificador.
     * @param id Identificador único de la entidad.
     * @returns Devuelve una entidad si existe o null.
     */
    async findOneById(id: ID): Promise<T | null> {
        return await this.repo.findOneBy({ id } as FindOptionsWhere<T>);
    }

    /**
     * Guarda una entidad en la base de datos.
     * @param entity Entidad que se quiere guardar.
     * @returns Devuelve una entidad guardada.
     */
    async save(entity: T): Promise<T> {
        return await this.repo.save(entity);
    }

    /**
     * Guarda múltiples entidades dentro de una transacción.
     * @param entities Lista de entidades.
     * @returns entidades guardadas.
     */
    async saveMany(entities: T[]): Promise<T[]> {
        return await this.repo.save(entities, { transaction: true })
    }

    /**
     * Actualiza los datos de una entidad.
     * @param id Condición para encontrar la entidad.
     * @param entity Datos a actualizar.
     * @returns Resultado de la actualización.
     */
    async update(id: FindOptionsWhere<T>, entity: T): Promise<UpdateResult> {
        return await this.repo.update(id, entity)
    }

    /**
     * Mezcla datos con una entidad existente sin guardarla.
     * @param entity Datos de la entidad.
     * @returns Entidad preparada para actualizar.
     */
    async merge(entity: T): Promise<T | undefined> {
        return await this.repo.preload(entity);
    }

    /**
     * Elimina una entidad de la base de datos.
     * @param entity Entidad a eliminar.
     * @returns Devuelve una entidad eliminada.
     */
    async remove(entity: T): Promise<T> {
        return await this.repo.remove(entity);
    }

    /**
     * Precarga una entidad existente.
     * @param entity Entidad parcial.
     * @returns Devuelve una entidad combinada o undefined.
     */
    async preload(entity: T): Promise<T | undefined> {
        return await this.repo.preload(entity)
    }

    /**
     * Buscar entidades por condiciones.
     * @param conditions Condiciones de búsqueda.
     * @returns Devuelve una lista de entidades.
     */
    async findBy(conditions: Partial<T>): Promise<T[]> {
        return await this.repo.find({ where: conditions });
    }

    /**
     * Cuenta el número total de registros.
     * @returns Número total de entidades.
     */
    async count (): Promise<number>{
        return await this.repo.count()
    }

    /**
     * Cuenta los registros según condiciones.
     * @param conditions Condiciones de búsqueda.
     * @returns Devuelve un número de entidades que cumplen la condición.
     */
    async countByCondition(conditions: Partial<T>): Promise<number>{
        return await this.repo.count({ where: conditions });
    }
}