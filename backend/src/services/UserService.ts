import { LoginUserDTO } from "../dtos/LoginUserDTO";
import { RegisterUserDTO } from "../dtos/RegisterUserDTO";
import { UserDTO } from "../dtos/UserDTO";
import { User } from "../Models/user.entity";

export interface UserService {
    getAll(): Promise<UserDTO[]>
    getOne(ind: number): Promise<UserDTO | null>
    insert(user: UserDTO): Promise<User>
    signUp(dto: RegisterUserDTO): Promise<UserDTO>
    login(dto: LoginUserDTO): Promise<string | null>
}
