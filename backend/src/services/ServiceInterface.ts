export interface ServiceInterface<T> {
    findOne(): T
    findAll(): T
    insertOne(): T
    deleteOne(): T
}