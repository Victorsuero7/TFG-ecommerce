import { SchemaResponse } from "../config/SchemaResponse";
import { LoginUserDTO } from "../dtos/LoginUserDTO";
import { RegisterUserDTO } from "../dtos/RegisterUserDTO";
import { UserDTO } from "../dtos/UserDTO";

export interface UserService {
    getAllPaginated(page: number): Promise<SchemaResponse<UserDTO[]>>
    getOne(id: number): Promise<SchemaResponse<UserDTO | null>>
    insert(user: UserDTO): Promise<SchemaResponse<UserDTO>>
    signUp(dto: RegisterUserDTO): Promise<SchemaResponse<UserDTO>>
    login(dto: LoginUserDTO): Promise<string | null>
    emailExists(email: string): Promise<SchemaResponse<string | null>>
    delete(id: number): Promise<SchemaResponse<UserDTO>>
    listDisabled(page: number): Promise<SchemaResponse<UserDTO[]>>
}
