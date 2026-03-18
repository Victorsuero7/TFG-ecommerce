import { Between, DataSource, EntityManager, FindOptionsWhere, ILike } from "typeorm";
import { Product } from "../Models/product.entity";
import { TypeORMRepository } from "./TypeORMRepository";
import { Category } from "../Models/category.entity";

/**
 * Repositorio específico para la entidad Product.
 * 
 * Proporciona los métodos de acceso a datos relacionados con productos,
 * incluyendo búsquedas por nombre, descripción, categoría y stock.
 */
export class ProductRepository extends TypeORMRepository<Product, number> {
    constructor(datasource: DataSource) {
        super(Product, datasource)
    }

    /**
     * Obtiene todos los productos habilitados y sus relaciones.
     * @returns Devuelve una lista de productos.
     */
    async findAll(): Promise<Product[]> {
        return await this.repo.find({ where: { enable: true }, relations: ['category', 'modifiedBy'] });
    }

    /**
     * Ejecuta una operación dentro de una transacción.
     * @param cb Función que contiene las operaciones a ejecutar.
     * @returns Devuelve el resultado de la transacción.
     */
    async transaction(cb: (entityManager: EntityManager) => Promise<unknown>) {
        return this.datasource.transaction(cb)
    }

    /**
     * Busca un producto por su Id.
     * @param id Identificador del producto.
     * @returns Devuelve un producto o null.
     */
    async findOneById(id: number): Promise<Product | null> {
        return await this.repo.findOne({
            where: { id },
            relations: ["category", 'modifiedBy']
        })
    }

    /**
     * Busca todos los productos habilitados por paginación.
     * @param offset Número de registros a saltar.
     * @param limit Número máximo de registros.
     * @returns Devuelve una lista de productos y número total de resultados.
     */
    async findAllByPage(offset: number, limit: number): Promise<[Product[], number]> {
        return await this.repo.findAndCount({ where: { enable: true }, skip: offset, take: limit, relations: ['category', 'modifiedBy'] })
    }

    /**
     * Busca productos por categoría por paginación.
     * @param category Categoría del producto.
     * @param offset Número de registros a saltar.
     * @param limit Número máximo de registros.
     * @returns Devuelve una lista de productos y un número total de resultados.
     */
    async findByCategory(category: Category, offset: number, limit: number): Promise<[Product[], number]> {
        return await this.repo.findAndCount({
            where: { category },
            order: {
                name: "ASC"
            },
            skip: offset,
            take: limit,
            relations: ['category', 'modifiedBy']
        })
    }

    /**
     * Busca productos por nombre de categoría por paginación.
     * @param name Nombre de la categoría del producto.
     * @param offset Número de registros a saltar.
     * @param limit Número máximo de registros.
     * @returns Devuelve una lista de productos y un número total de resultados.
     */
    async findByCategoryName(categoryName: string): Promise<Product[]> {
        return await this.repo.find({
            where: { category: { name: ILike(`%${categoryName}%`) } },
            relations: ['category', 'modifiedBy']
        })
    }

    /**
     * Busca productos por nombre usando búsqueda parcial.
     * 
     * @param name - Nombre del producto.
     * @returns Lista de productos encontrados.
     */
    async findByName(name: string): Promise<Product[]> {
        return await this.repo.find({ where: { name: ILike(`%${name}%`) }, relations: ['category', 'modifiedBy'] })
    }
    /**
    * Busca productos que contengan un texto en su descripción.
    * 
    * @param description - Texto parcial a buscar en la descripción del producto.
    * @returns Lista de productos que coinciden con la descripción.
    */
    async findByDescription(description: string): Promise<Product[]> {
        return await this.repo.find({ where: { description: ILike(`%${description}%`) }, relations: ['category', 'modifiedBy'] })
    }

    /**
    * Obtiene el número total de productos habilitados.
    * 
    * @returns Número total de productos donde enable = true
    */
    async totalResults(): Promise<number> {
        return await this.repo.count({ where: { enable: true } })
    }

    /**
    * Obtiene el número total de productos habilitados
    * cuya descripción contiene un texto específico.
    * 
    * @param description - Texto parcial a buscar en la descripción.
    * @returns Número de productos que coinciden con la descripción y están habilitados.
    */
    async totalResultsByDescription(description: string): Promise<number> {
        return await this.repo.countBy({ description: ILike(`%${description}%`), enable: true })
    }

    /**
    * Obtiene el número total de productos habilitados.
    * cuyo nombre contiene un texto específico.
    * 
    * @param name - Texto parcial a buscar en el nombre del producto.
    * @returns Número de productos que coinciden con el nombre y están habilitados.
    */
    async totalResultsByName(name: string): Promise<number> {
        return await this.repo.countBy({ name: ILike(`%${name}%`), enable: true })
    }

    /**
     * Busca productos por rango de stock.
     * 
     * @param from - Stock mínimo.
     * @param to - Stock máximo.
     * @param offset - Inicio de paginación.
     * @param limit - Número máximo de resultados.
     * @returns Devuelve lista de productos encontrados y total.
     */
    async stockBetween(from: number, to: number, offset: number, limit: number): Promise<[Product[], number]> {
        return await this.repo.findAndCount({
            where: { stock: Between(from, to), enable: true },
            order: { stock: "DESC" },
            skip: offset,
            take: limit
        })
    }

    /**
     * Obtiene los productos deshabilitados con paginación.
     * 
     * @param offset Número de registros a saltar. 
     * @param limit Número máximo de registros.
     * @returns Devuelve una lista de productos deshabilitados y el total.
     */
    async getDisabled(offset: number, limit: number): Promise<[Product[], number]> {
        return await this.repo.findAndCount({
            where: {
                enable: false
            },
            order: {
                name: "ASC"
            },
            skip: offset,
            take: limit
        })
    }
}