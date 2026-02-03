import { LoginUserDTO } from "../dtos/LoginUserDTO";
import { RegisterUserDTO } from "../dtos/RegisterUserDTO";
import { User } from "../Models/user.entity";

export interface UserService {
    // singUp(user: User): Promise<User>
    getAll(): Promise<User[]>
    getOne(ind: number): Promise<User | null>
    insert(user: User): Promise<User>
    findByEmail(email: string): Promise<User | null>
    signUp(dto: RegisterUserDTO): Promise<User>
    login(dto: LoginUserDTO): Promise<string | null>
}
