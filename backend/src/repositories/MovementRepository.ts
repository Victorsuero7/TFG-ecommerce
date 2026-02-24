import { DataSource, ILike } from "typeorm";
import { Movement } from "../Models/DataMovements.entity";
import { TypeORMRepository } from "./TypeORMRepository";

export class MovementRepository extends TypeORMRepository<Movement, number> {
    constructor(datasource: DataSource) {
        super(Movement, datasource)
    }

    async findAllWithRelations(): Promise<Movement[]> {
        return await this.repo.find({
            relations: ['product', 'modifiedBy'],
            order: { lastModification: 'DESC' }
        });
    }

    async findAllByPageWithRelations(offset: number, limit: number): Promise<[Movement[], number]> {
        return await this.repo.findAndCount({
            relations: ['product', 'modifiedBy'],
            order: { lastModification: 'DESC' },
            skip: offset,
            take: limit
        });
    }

    async findByProductName(name: string): Promise<Movement[]> {
        return await this.repo.find({
            where: { product: { name: ILike(`%${name}%`) } },
            relations: ['product', 'modifiedBy'],
            order: { lastModification: 'DESC' }
        });
    }
}
