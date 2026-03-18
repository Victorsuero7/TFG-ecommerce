import { SchemaResponse } from "../config/SchemaResponse";
import { LoginUserDTO } from "../dtos/LoginUserDTO";
import { RegisterUserDTO } from "../dtos/RegisterUserDTO";
import { UserDTO } from "../dtos/UserDTO";

/**
 * Interfaz que define las operaciones disponibles para la gestión
 * de usuarios en la aplicación.
 */
export interface UserService {

    /** Obtiene todos los usuarios con paginación. */
    getAllPaginated(page: number): Promise<SchemaResponse<UserDTO[]>>
    /** Obtiene un usuario por su identificador. */
    getOne(id: number): Promise<SchemaResponse<UserDTO | null>>
    /** Inserta un nuevo usuario. */
    insert(user: UserDTO): Promise<SchemaResponse<UserDTO>>
    /** Registra un nuevo usuario en el sistema. */
    signUp(dto: RegisterUserDTO): Promise<SchemaResponse<UserDTO>>
    /** Realiza el login del usuario y devuelve un token JWT. */
    login(dto: LoginUserDTO): Promise<string | null>
    /** Comprueba si un email está registrado. */
    emailExists(email: string): Promise<SchemaResponse<string | null>>
    /** Deshabilita un usuario (borrado lógico). */
    delete(id: number): Promise<SchemaResponse<UserDTO>>
    /** Obtiene los usuarios deshabilitados con paginación. */
    listDisabled(page: number): Promise<SchemaResponse<UserDTO[]>>
}
