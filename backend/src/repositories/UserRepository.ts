import { DataSource } from "typeorm";
import { User } from "../Models/user.entity";
import { TypeORMRepository } from "./TypeORMRepository";

/**
 * Repositorio específico para la entidad de usuario.
 * 
 * Extiende el repositorio genérico TypeORMRepository añadiendo
 * métodos específicos para gestión de usuarios.
 */
export class UserRepository extends TypeORMRepository<User, number> {
    
    /**
     * Constructor del repositorio de usuarios.
     * @param datasource Fuente de datos de TypeORM.
     */
    constructor(datasource: DataSource) {
        super(User, datasource)
    }

    /**
     * Busca un usuario por email.
     * @param email Correo electrónico del usuario.
     * @returns Devuelve un Usuario encontrado o null.
     */
    async findByEmail(email: string): Promise<User | null> {
        return await this.repo.findOneBy({ email })
    }

    /**
     * Busca usuarios habilitados con paginación.
     * @param offset Número de registros a saltar.
     * @param limit Número máximo de registros a devolver.
     * @returns Devuelve una lista de usuarios y número total de resultados.
     */
    async findAllByPage(offset: number, limit: number): Promise<[User[], number]> {
        return await this.repo.findAndCount({ where: { enable: true }, skip: offset, take: limit })
    }

    /**
     * Obtiene usuarios deshabilitados.
     * @param offset Número de registros a saltar.
     * @param limit Número máximo de registros.
     * @returns Lista de usuarios deshabilitados y total.
     */
    async getDisabled(offset: number, limit: number): Promise<[User[], number]> {
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