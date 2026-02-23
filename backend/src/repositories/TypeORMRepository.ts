import { asyncWrapProviders } from "async_hooks";
import { Repository, DataSource, EntityTarget, ObjectLiteral, FindOptionsWhere, UpdateResult } from "typeorm";

export abstract class TypeORMRepository<T extends ObjectLiteral, ID> {
    protected repo: Repository<T>;

    constructor(
        entity: EntityTarget<T>,
        public readonly datasource: DataSource
    ) {
        this.repo = datasource.getRepository(entity);
    }

    async findAll(): Promise<T[]> {
        return await this.repo.find();
    }

    async findAllByPage(offset: number, limit: number): Promise<T[] | [T[], number]> {
        return await this.repo.find({ skip: offset, take: limit })
    }

    async findOneById(id: ID): Promise<T | null> {
        return await this.repo.findOneBy({ id } as FindOptionsWhere<T>);
    }

    async save(entity: T): Promise<T> {
        return await this.repo.save(entity);
    }

    async saveMany(entities: T[]): Promise<T[]> {
        return await this.repo.save(entities, { transaction: true })
    }

    async update(id: FindOptionsWhere<T>, entity: T): Promise<UpdateResult> {
        return await this.repo.update(id, entity)
    }

    async merge(entity: T): Promise<T | undefined> {
        return await this.repo.preload(entity);
    }

    async remove(entity: T): Promise<T> {
        return await this.repo.remove(entity);
    }

    async preload(entity: T): Promise<T | undefined> {
        return await this.repo.preload(entity)
    }

    async findBy(conditions: Partial<T>): Promise<T[]> {
        return await this.repo.find({ where: conditions });
    }

    async count(): Promise<number> {
        return await this.repo.count()
    }

    async countByCondition(conditions: Partial<T>): Promise<number> {
        return await this.repo.count({ where: conditions });
    }
}