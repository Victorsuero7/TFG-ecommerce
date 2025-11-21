import { User } from "../Models/user.entity";
import { UserService } from "./UserService";
import { UserRepository } from "../repositories/UserRepository";

export class UserServiceImpl implements UserService {

    constructor(repository: UserRepository) {
        this.userRepo = repository
    }
    isActiveUser(user: User): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    private readonly userRepo;
    async findOneById(id: number): Promise<User | null> {
        return await this.userRepo.findOneBy({ id: id })
    }
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepo.findOneBy({ email: email })
    }
    async mediumTicket(user: User): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async findAll(): Promise<User[]> {
        return await this.userRepo.find()
    }
    async deleteOne(id: number): Promise<number> {
        let result = await this.userRepo.delete({ id })
        return result != null ? 1 : 0
    }
    async insertOne(data: User): Promise<User> { //save e insert se comportan diferente, save sirve tanto para insertar como actualizar
        return await this.userRepo.save(data)
    }

}