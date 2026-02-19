import { Between, DataSource, EntityManager, Or } from "typeorm";
import { TypeORMRepository } from "./TypeORMRepository";
import { Movement } from "../Models/DataMovements.entity";

export class MovementRepository extends TypeORMRepository<Movement, number> {
    constructor(datasource: DataSource) {
        super(Movement, datasource)
    }

    private RELATIONS = ["category", 'modifiedBy']

    async transaction(cb: (entityManager: EntityManager) => Promise<unknown>) {
        return this.datasource.transaction(cb)
    }

    async findOneById(id: number, relations: string[] = this.RELATIONS): Promise<Movement | null> {
        return await this.repo.findOne({
            where: { id: id },
            relations: relations
        })
    }

    async findAllByPage(offset: number, limit: number, relations: string[] = this.RELATIONS): Promise<[Movement[], number]> {
        return await this.repo.findAndCount({
            where: {},
            order: { id: "ASC" },
            skip: offset,
            take: limit,
            relations: relations
        })
    }

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

    async findByProduct(productId: number, offset: number, limit: number, relations: string[] = this.RELATIONS): Promise<[Movement[], number]> {
        return await this.repo.findAndCount({
            // where: { product: {id:productId} },
            where:{ },
            order: {
                id: "ASC"
            },
            skip: offset,
            take: limit,
            relations: relations
        })
    }

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