import { Between, DataSource, EntityManager, FindOptionsWhere, ILike, Like } from "typeorm";
import { TypeORMRepository } from "./TypeORMRepository";
import { Movement } from "../Models/DataMovements.entity";
import { User } from "../Models/user.entity";
import { Product } from "../Models/product.entity";

/**
 * Tipo que define las condiciones posibles para filtrar
 * en las consultas.
 */
type Conditions = {
    userId?: number,
    productId?: number,
    productName?: string,
    from?: string,
    to?: string
};

    /**
    * Repositorio encargado de gestionar las operaciones de acceso a datos
    * de la entidad Movement.
    */
export class MovementRepository extends TypeORMRepository<Movement, number> {
    
    /**
     * Constructor del repositorio.
     * @param datasource Conexión a la base de datos.
     */
    constructor(datasource: DataSource) {
        super(Movement, datasource)
    }
    /**
     * Relaciones que se cargan por defecto al consultar movimientos.
     */
    private RELATIONS = ["product", 'modifiedBy']

    /**
     * Construye dinámicamente las condiciones de búsqueda a partir de filtros recibidos.
     * @param conditions Condiciones del filtrado.
     * @returns Devuelve el objeto con las condiciones para la consulta.
     */
    private buildWhere(conditions: Conditions) {
        const where: Partial<Movement> = {};
        if (conditions.userId !== undefined) {
            where.modifiedBy = { id: conditions.userId } as User
        }
        if (conditions.productId !== undefined || conditions.productName !== undefined) {
            where.product = { id: conditions.productId, name: ILike(`%${conditions.productName ?? ''}%`) } as unknown as Product
        };
        // if (conditions.productName !== undefined) {
        //     where.product = { name: ILike(`%${conditions.productName}%`) } as Product
        // };
        if (conditions.from !== undefined && conditions.to !== undefined) {
            console.log("FECHAS: ", conditions);
            where.lastModification = Between(new Date(conditions.from), new Date(conditions.to)) as unknown as Date
        };
        console.log('WHERE: ', where);
        return where;
    }
    // private buildWhere(conditions: Conditions) {
    //     const where: Partial<Movement>[] = [];
    //     if (conditions.userId !== undefined) {
    //         where.push({
    //             modifiedBy: { id: conditions.userId } as User
    //         });
    //     }
    //     if (conditions.productId !== undefined) {
    //         where.push({
    //             product: { id: conditions.productId } as Product
    //         });
    //     }
    //     if (conditions.from !== undefined && conditions.to !== undefined) {
    //         where.push({
    //             lastModification: Between(conditions.from, conditions.to) as unknown as Date
    //         })
    //     }
    //     return where;
    // }

    /**
     * Ejecuta una operación dentro de una transacción de base de datos.
     * 
     * @param cb Función que contiene las operaciones a ejecutar.
     * @returns Devuelve el resultado de la función ejecutada.
     */
    async transaction(cb: (entityManager: EntityManager) => Promise<unknown>) {
        return this.datasource.transaction(cb)
    }

    /**
     * Obtiene un movimiento por su identificador.
     * 
     * @param id Identificador del movimiento.
     * @param relations Relaciones a cargar.
     * @returns Devuelve movimiento encontrado o null.
     */
    async findOneById(id: number, relations: string[] = this.RELATIONS): Promise<Movement | null> {
        return await this.repo.findOne({
            where: { id: id },
            relations: relations
        })
    }

    /**
     * Obtiene todos los movimientos con paginación.
     * 
     * @param offset Número de registros a saltar. 
     * @param limit Número máximo de registros.
     * @param relations Relaciones a cargar.
     * @returns Lista de movimientos y total de registros.
     */
    async findAllByPage(offset: number, limit: number, relations: string[] = this.RELATIONS): Promise<[Movement[], number]> {
        return await this.repo.findAndCount({
            // where: {},
            order: { id: "ASC" },
            skip: offset,
            take: limit,
            relations: relations
        })
    }

    /**
     * Busca movimientos aplicando diferentes filtros.
     * 
     * @param conditions Condiciones de búsqueda.
     * @param offset Número de registros a omitir.
     * @param limit Número máximo de registros.
     * @param relations Relaciones a cargar.
     * @returns Devuelve una lista de movimientos y el total.
     */
    async findByConditions(conditions: Conditions, offset: number, limit: number, relations: string[] = this.RELATIONS): Promise<[Movement[], number]> {
        console.log('CONDITONS: ', conditions);
        return await this.repo.findAndCount({
            where: this.buildWhere(conditions),
            order: {
                id: "ASC"
            },
            skip: offset,
            take: limit,
            relations: relations
        })
    }

    /**
     * Busca movimientos por identificador de usuario con paginación.
     * 
     * @param userId Identificador único del usuario.
     * @param offset Número de registros a saltar.
     * @param limit Número máximo de registros.
     * @param relations Relaciones a cargar.
     * @returns Devuelve una lista de movimientos realizados por un usuario y el total de registros.
     */
    async findByUser(userId: number, offset: number, limit: number, relations: string[] = this.RELATIONS): Promise<[Movement[], number]> {
        return await this.repo.findAndCount({
            where: { modifiedBy: { id: userId } },
            order: {
                id: "ASC"
            },
            skip: offset,
            take: limit,
            relations: relations
        })
    }

    /**
     * Busca movimientos por identifcador de producto con paginación.
     * 
     * @param productId Identificador único del producto.
     * @param offset Número de registros a saltar.
     * @param limit Número máximo de registros.
     * @param relations Relaciones a cargar.
     * @returns Devuelve una lista de movimientos de un producto y el total de registros.
     */
    async findByProduct(productId: number, offset: number, limit: number, relations: string[] = this.RELATIONS): Promise<[Movement[], number]> {
        return await this.repo.findAndCount({
            // where: { product: {id:productId} },
            where: {},
            order: {
                id: "ASC"
            },
            skip: offset,
            take: limit,
            relations: relations
        })
    }

    /**
     * Busca movimientos dentro de un rango de fecha con paginación.
     * 
     * @param from Fecha de inicio.
     * @param to Fecha final.
     * @param offset Número de registros a saltar.
     * @param limit Número máximo de registros.
     * @param relations Relaciones a cargar.
     * @returns Devuelve una lista de movimientos comprendidos entre las dos fechas indicadas y el total
     * de registros.
     */
    async findByDateRange(from: Date, to: Date = new Date, offset: number, limit: number, relations: string[] = this.RELATIONS): Promise<[Movement[], number]> {
        return await this.repo.findAndCount({
            where: {
                lastModification: Between(from, to)
            },
            order: {
                id: "ASC"
            },
            skip: offset,
            take: limit,
            relations: relations
        })
    }
}