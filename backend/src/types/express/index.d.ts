declare global {
    namespace Express {
        interface Request {
            user?: any; // o el tipo que uses
        }
    }
}

export { }; // Esto es importante para que sea un módulo