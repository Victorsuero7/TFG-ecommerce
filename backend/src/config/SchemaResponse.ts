export class SchemaResponse<T> {
    constructor(
        public result: T,
        public metadata?: Metadata<T>
    ) { }
}

export type Metadata<T> = {
    count?: number,
    failures?: T
}