export class SchemaResponse<T> {
    constructor(
        public result: T,
<<<<<<< HEAD
        public metadata?: Metadata
    ) { }
}

export type Metadata = {
    count?: number,
=======
        public metadata?: Metadata<T>
    ) { }
}

export type Metadata<T> = {
    count?: number,
    failures?: T
>>>>>>> dc4e125dcc5b1410190debdd771a48e02ee87574
}