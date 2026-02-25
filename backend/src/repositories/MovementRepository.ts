import { Between, DataSource, EntityManager, FindOptionsWhere } from "typeorm";
import { TypeORMRepository } from "./TypeORMRepository";
import { Movement } from "../Models/DataMovements.entity";
import { User } from "../Models/user.entity";
import { Product } from "../Models/product.entity";

type Conditions = {
    userId?: number;
    productId?: number;
    from?: string,
    to?: string
};

export class MovementRepository extends TypeORMRepository<Movement, number> {
    constructor(datasource: DataSource) {
        super(Movement, datasource)
    }

    private RELATIONS = ["product", 'modifiedBy']

    private buildWhere(conditions: Conditions) {
        const where: any = {};
        if (conditions.userId !== undefined) {
            where.modifiedBy = { id: conditions.userId } as User
        }
        if (conditions.productId !== undefined) {
            where.product = { id: conditions.productId } as Product
        };
        if (conditions.from !== undefined && conditions.to !== undefined) {
            console.log("FECHAS: ", conditions);
            where.lastModification = Between(new Date(conditions.from), new Date(conditions.to)) as unknown as Date
        };
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
            // where: {},
            order: { id: "ASC" },
            skip: offset,
            take: limit,
            relations: relations
        })
    }

    async findByConditions(conditions: Conditions, offset: number, limit: number, relations: string[] = this.RELATIONS): Promise<[Movement[], number]> {
        console.log(conditions);
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
            where: {},
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