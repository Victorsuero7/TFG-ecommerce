export class SchemaResponse<T> {
    constructor(
        public result: T,
        public metadata?: Metadata
    ) { }
}

export type Metadata = {
    count?: number,
}