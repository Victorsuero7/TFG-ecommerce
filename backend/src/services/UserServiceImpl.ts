import { RegisterUserDTO } from "../dtos/RegisterUserDTO";
import { User } from "../Models/user.entity";
import { UserRepository } from "../repositories/UserRepository";
import { HttpErrors } from "../utils/HttpErrors";
import * as bcrypt from 'bcrypt';
import { UserService } from "./UserService";
import { LoginUserDTO } from "../dtos/LoginUserDTO";
import { JWTAdapter } from "../utils/Jwt";
import { UserDTO } from "../dtos/UserDTO";

export class UserServiceImpl implements UserService {
    private readonly repo: UserRepository;
    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    async getAll(): Promise<UserDTO[]> {
        try {
            const result = await this.repo.findAll()
            return result.map(e => UserDTO.fromEntity(e))
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getOne(id: number): Promise<UserDTO | null> {
        try {
            const user = await this.repo.findOneById(id)
            if (!user) throw HttpErrors.NotFound("User not found")
            return UserDTO.fromEntity(user)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async insert(dto: UserDTO): Promise<User> {
        try {
            const userExists = await this.repo.findByEmail(dto.email)
            if (userExists) throw HttpErrors.badRequest("User alredy exists")

            const user = dto.toEntity()
            const result = await this.repo.save(user)
            return result
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async login(dto: LoginUserDTO): Promise<string | null> {
        try {
            const user = await this.repo.findByEmail(dto.email)
            if (!user) throw HttpErrors.badRequest("Invalid credentials")
            const validPassword = await bcrypt.compare(dto.password, user!.password)
            if (!validPassword) throw HttpErrors.badRequest("Invalid credentials")
            const token = await JWTAdapter.generateToken({ id: user!.id, name: user!.name, role: user!.role }, '2h')
            return token
        } catch (error) {
            console.log(error)
            throw HttpErrors.internalServerError("Something went wrong")
        }
    }

    async signUp(dto: RegisterUserDTO): Promise<UserDTO> {
        try {
            const userExists = await this.repo.findByEmail(dto.email)
            if (userExists) throw HttpErrors.badRequest("User alredy exist")
            const salt = bcrypt.genSaltSync(5);
            let hash = bcrypt.hashSync(dto.password, salt)
            const user = new User()
            user.email = dto!.email
            user.name = dto!.name
            user.lastName = dto!.lastName
            user.phoneNumber = dto!.phoneNumber
            user.password = hash

            const userRegistered = await this.repo.save(user)
            return UserDTO.fromEntity(userRegistered)
        }
        catch (error) {
            console.log(error)
            throw HttpErrors.internalServerError("Something went wrong")
        }
    }

    async emailExists(email: string): Promise<User | null> {
        const userExists = await this.repo.findByEmail(email)
        if (userExists) throw HttpErrors.badRequest("User alredy exist")
        return userExists
    }
}