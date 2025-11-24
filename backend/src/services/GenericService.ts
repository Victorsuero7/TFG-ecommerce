export interface GenericService<E, ID> {
    findOneById(id: ID): Promise<E | null>;
    findAll(): Promise<E[]>;
    insertOne(data: E): Promise<E>;
    deleteOne(id: number): Promise<number>;
}
