import { Repository, DataSource, EntityTarget, ObjectLiteral, FindOptionsWhere, UpdateResult } from "typeorm";

export abstract class TypeORMRepository<T extends ObjectLiteral, ID> {
    protected repo: Repository<T>;

    constructor(
        entity: EntityTarget<T>,
        protected readonly datasource: DataSource
    ) {
        this.repo = datasource.getRepository(entity);
    }

    async findAll(): Promise<T[]> {
        return await this.repo.find();
    }

    async findOneById(id: ID): Promise<T | null> {
        return await this.repo.findOneBy({ id } as FindOptionsWhere<T>);
    }

    async save(entity: T): Promise<T> {
        return await this.repo.save(entity);
    }

    async merge(entity: T): Promise<T | undefined> {
        return await this.repo.preload(entity);
    }

    async remove(entity: T): Promise<T> {
        return await this.repo.remove(entity);
    }

    async findBy(conditions: Partial<T>): Promise<T[]> {
        return await this.repo.find({ where: conditions });
    }
}