// import { Validators } from "../utils/Validators";

/**
 * DTO utilizado para el registro de nuevos usuarios en el sistema.
 * 
 * Se encarga de validar y transportar los datos necearios cuando
 * un usuario crea una cuenta.
 */
export class RegisterUserDTO {

    /**
     * Constructor privado para evitar crear instancias sin pasar por 
     * el método de validación 'create'.
     * 
     * @param name Nombre del usuario.
     * @param lastName Apellidos del usuario.
     * @param email Correo electrónico del usuario.
     * @param phoneNumber Teléfono del usuario.
     * @param password Contraseña del usuario.
     * @param birthDate Fecha de nacimiento del usuario.
     */
    private constructor(
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        public readonly password: string,
        public readonly birthDate?: Date | null) { }
    
    /**
     * Crea un RegisterUserDTO validando previamente los datos recibidos 
     * desde la petición HTTP.
     * 
     * Si algún campo obligatorio falta o no cumple las condiciones mínimas,
     * se devuelve un mensaje de error.
     * 
     * @param body Objeto recibido en el body de la request.
     * @returns Devuelve una tupla donde la primera posición contiene un mensaje 
     * de error o null, y la segunda contiene el DTO si la validación es correcta.
     */
    static create(body: { [key: string]: any; }): [string | null, RegisterUserDTO?] {

        const { name, lastName, email, password, phoneNumber, birthDate } = body;
        if (!name) return ['Missing name'];
        if (!email) return ['Missing email'];
        if (!phoneNumber) return ['Missing phone number'];
        /** Validación opcional del email mediante unidades externas. */
        // if (!Validators.validateEmail(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];
        /** Validación opcional de contraseña mediante utilidades externas. */
        // if (!Validators.validatePassword(password)) return ['Password is not valid'];
        if (password.length < 6) return ['Password too short'];

        let normalizedBirthDate: Date | null | undefined = undefined;
        if (Object.prototype.hasOwnProperty.call(body, 'birthDate')) {
            if (!birthDate) {
                normalizedBirthDate = null;
            } else {
                const parsedBirthDate = new Date(birthDate);
                normalizedBirthDate = Number.isNaN(parsedBirthDate.getTime()) ? null : parsedBirthDate;
            }
        }

        const dto = new RegisterUserDTO(name, lastName, email, phoneNumber, password, normalizedBirthDate)
        return [null, dto];
    }
}