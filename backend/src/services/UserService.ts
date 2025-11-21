import { User } from "../Models/user.entity";
import { GenericService } from "./GenericService";

export interface UserService extends GenericService<User, number> {
    findByEmail(email: string): Promise<User | null>
    isActiveUser(user: User): Promise<boolean>
    mediumTicket(user: User): Promise<number>
}