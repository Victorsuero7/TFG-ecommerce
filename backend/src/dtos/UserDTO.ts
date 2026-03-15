import { User, ROLE } from "../Models/user.entity";


/**
 * Data Transfer Object (DTO) para el usuario.
 * 
 * Se utiliza para transportar datos entre capas de la aplicación
 * sin exponer directamente la entidad en la base de datos.
 */
export class UserDTO {

    /**
     * Crea una instancia de UserDTO.
     * @param id -Identificador único del usuario.
     * @param name - Nombre del usuario.
     * @param lastName - Apellidos del usuario.
     * @param email - Correo electrónico del usuario.
     * @param phoneNumber - Número de teléfono del usuario.
     * @param role - Rol del usuario.
     */
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        // public readonly birthDate!: Date;
        public readonly role: ROLE | null) { }
    
    /**
     * Convierte una entidad User en un UserDTO.
     * 
     * @param user - Entidad de usuario obtenida en la base de datos.
     * @returns - Devuelve un objeto UserDTO con los datos del usuario.
     */
    static fromEntity(user: User): UserDTO {
        return new UserDTO(user?.id, user?.name, user?.lastName, user?.email, user?.phoneNumber, user?.role)
    }

    /**
     * Convierte el DTO en una entidad User.
     * 
     * @returns Devuelve una entidad User con los datos del DTO.
     */
    toEntity(): User {
        const user = new User()
        Object.assign(user, this)
        return user
    }

    /**
     * Crea un DTO a partir de un objeto genérico.
     * 
     * @param object Objeto con propiedades del usuario.
     * @returns Devuelve una nueva instancia de UserDTO.
     */
    static createDTO(object: { [key: string]: any; }): UserDTO {
        const { id, name, lastName, email, phoneNumber, role } = object;
        return new UserDTO(id, name, lastName, email, phoneNumber, role)
    }
}