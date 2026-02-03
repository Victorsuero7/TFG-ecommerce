import { RegisterUserDTO } from "../dtos/RegisterUserDTO";
import { User } from "../Models/user.entity";
import { UserRepository } from "../repositories/UserRepository";
import { HttpErrors } from "../utils/HttpErrors";
import * as bcrypt from 'bcrypt';
import { UserService } from "./UserService";

export class UserServiceImpl implements UserService {
    private readonly repo: UserRepository;
    constructor(repo: UserRepository) {
        this.repo = repo;
    }
    // async singUp(user: User): Promise<User> {
    //     throw new Error("Method not implemented.");
    // }
    async getAll(): Promise<User[]> {
        return await this.repo.findAll()
    }
    async getOne(id: number): Promise<User | null> {
        return await this.repo.findOneById(id)
    }
    async insert(user: User): Promise<User> {
        return await this.repo.save(user)
    }
    async findByEmail(email: string): Promise<User | null> {
        return await this.repo.findByEmail(email)
    }

    async signUp(dto: RegisterUserDTO): Promise<User> {

        try {
            const userExists = await this.findByEmail(dto.email)
            if (userExists) {
                throw HttpErrors.badRequest("User alredy exist")
            }
            const salt = bcrypt.genSaltSync(5);
            let hash = bcrypt.hashSync(dto.password, salt)
            const user = new User()
            user.email = dto!.email
            user.name = dto!.name
            user.lastName = dto!.lastName
            user.phoneNumber = dto!.phoneNumber
            user.password = hash

            const userRegistered = await this.insert(user)
            return userRegistered

        }
        catch {
            throw HttpErrors.internalServerError("Something went wrong")
        }
    }


}