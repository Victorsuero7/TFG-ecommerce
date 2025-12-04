import { User } from "../Models/user.entity";

export interface UserService {
    singUp(user: User): Promise<User>
    getAll(): Promise<User[]>
    getOne(ind: number): Promise<User | null>
    insert(user: User): Promise<User>
}
