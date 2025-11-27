export class HttpErrors extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly message: string

    ) { super(message) }

    static badRequest(message: string) {
        return new HttpErrors(400, message)
    }

    static unautorithed(message: string) {
        return new HttpErrors(401, message)
    }

    static forbidden(message: string) {
        return new HttpErrors(403, message)
    }

    static NotFound(message: string = 'Not Found') {
        return new HttpErrors(404, message)
    }

    static internalServerError(message: string = 'Internal Server Error') {
        console.log(message);
        return new HttpErrors(500, message)
    }

}