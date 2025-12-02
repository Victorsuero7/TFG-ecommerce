import { User } from "../Models/user.entity";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "./UserService";

export class UserServiceImpl implements UserService {
    private readonly repo: UserRepository;
    constructor(repo: UserRepository) {
        this.repo = repo;
    }
    singUp(user: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    async getAll(): Promise<User[]> {
        return await this.repo.findAll()
    }
    async getOne(id: number): Promise<User | null> {
        return await this.repo.findOneById(id)
    }
    async insert(user: User): Promise<User> {
        return await this.repo.save(user)
    }


}