import { RegisterUserDTO } from "../dtos/RegisterUserDTO";
import { User } from "../Models/user.entity";
import { UserRepository } from "../repositories/UserRepository";
import { HttpErrors } from "../utils/HttpErrors";
import * as bcrypt from 'bcrypt';
import { UserService } from "./UserService";
import { LoginUserDTO } from "../dtos/LoginUserDTO";
import { JWTAdapter } from "../utils/Jwt";
import { UserDTO } from "../dtos/UserDTO";
import { SchemaResponse } from "../config/SchemaResponse";
import { envs } from "../config/envs";

const PPP = envs.PRODUCTS_PER_PAGE ?? 20


export class UserServiceImpl implements UserService {
    private readonly repo: UserRepository;
    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    async getAllPaginated(page: number): Promise<SchemaResponse<UserDTO[]>> {
        try {
            const [result, count] = await this.repo.findAllByPage(PPP * (page - 1), PPP)
            if (result.length === 0) throw HttpErrors.NotFound()
            return new SchemaResponse(result.map(e => UserDTO.fromEntity(e)), { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getOne(id: number): Promise<SchemaResponse<UserDTO | null>> {
        try {
            const result = await this.repo.findOneById(id)
            if (!result) throw HttpErrors.NotFound()
            return new SchemaResponse(UserDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async insert(dto: UserDTO): Promise<SchemaResponse<UserDTO>> {
        try {
            const userExists = await this.repo.findByEmail(dto.email)
            if (userExists) throw HttpErrors.badRequest("User alredy exists")

            const user = dto.toEntity()
            const result = await this.repo.save(user)
            return new SchemaResponse(UserDTO.fromEntity(result))
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

    // async emailExists(email: string): Promise<boolean> {
    //     const user = await this.repo.findByEmail(email)
    //     return !!user
    // }

    async signUp(dto: RegisterUserDTO): Promise<SchemaResponse<UserDTO>> {
        try {
            const userExists = await this.repo.findByEmail(dto.email)
            if (userExists) throw HttpErrors.badRequest("Ya existe una cuenta con ese email")
            const salt = bcrypt.genSaltSync(5);
            let hash = bcrypt.hashSync(dto.password, salt)
            const user = new User()
            user.email = dto!.email
            user.name = dto!.name
            user.lastName = dto!.lastName
            user.phoneNumber = dto!.phoneNumber
            user.password = hash

            const userRegistered = await this.repo.save(user)
            return new SchemaResponse(UserDTO.fromEntity(userRegistered))
        }
        catch (error) {
            console.log(error)
            throw HttpErrors.internalServerError("Something went wrong")
        }
    }

    async emailExists(email: string): Promise<SchemaResponse<string | null>> {
        const userExists = await this.repo.findByEmail(email)
        if (userExists) throw HttpErrors.badRequest("User alredy exist")
        return new SchemaResponse("Email available")

    }

    async listDisabled(page: number): Promise<SchemaResponse<UserDTO[]>> {
        try {
            const [result, count] = await this.repo.getDisabled(PPP * (page - 1), PPP)
            if (result.length === 0) throw HttpErrors.NotFound()
            return new SchemaResponse(result.map((e) => UserDTO.fromEntity(e)), { count })
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async delete(id: number): Promise<SchemaResponse<UserDTO>> {
        try {
            const entity = await this.repo.findOneById(id)
            if (!entity) throw HttpErrors.NotFound()
            entity.enable = false
            const result = await this.repo.save(entity)
            if (!result) throw HttpErrors.internalServerError()
            return new SchemaResponse(UserDTO.fromEntity(result))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}