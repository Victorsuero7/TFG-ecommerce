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

/**
 * Implementación del servicio de usuarios.
 * 
 * Contiene la lógica de negocio relacionada con la gestión de 
 * usuarios y autenticación.
 */
export class UserServiceImpl implements UserService {
    private readonly repo: UserRepository;

    /**
     * Constructor del repositorio.
     * @param repo Repositorio de usuarios.
     */
    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    /**
     * Obtiene todos los usuarios utilizando paginación.
     * @param page El número de la página a consultar.
     * @returns Devuelve una lista de UserDTO.
     */
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

    /**
     * Obtiene un usuario por su identificador.
     * @param id El identificador único del usuario.
     * @returns Devuelve el usuario si existe o null.
     */
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

    /**
     * Inserta un nuevo usuario en la base de datos.
     * @param dto UsuarioDTO a guardar.
     * @returns Devuelve el usuario guardado.
     */
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

    /**
     * Autenticación del usuario y generación de token JWT.
     * @param dto UsuarioDTO a autenticar.
     * @returns Devuelve un token JWT o null.
     */
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
            if (error instanceof HttpErrors) throw error;
            throw HttpErrors.internalServerError("Something went wrong")
        }
    }

    // async emailExists(email: string): Promise<boolean> {
    //     const user = await this.repo.findByEmail(email)
    //     return !!user
    // }

    /**
     * Registra un usuario nuevo en el sistema.
     * @param dto UsuarioDTO a registrar.
     * @returns Devuelve el usuario registrado.
     */
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
            if (error instanceof HttpErrors) throw error;
            throw HttpErrors.internalServerError("Something went wrong")
        }
    }

    /**
     * Comprueba si un email existe en la base de datos.
     * @param email Correo electrónico a comprobar.
     * @returns Devuelve mensaje.
     */
    async emailExists(email: string): Promise<SchemaResponse<string | null>> {
        const userExists = await this.repo.findByEmail(email)
        if (userExists) throw HttpErrors.badRequest("User alredy exist")
        return new SchemaResponse("Email available")

    }

    /**
     * Obtiene los usuarios deshabilitados.
     * @param page Página en la que buscar.
     * @returns Devuelve lista de usuarios.
     */
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

    /**
     * Deshabilita un usuario.
     * @param id Identificador único del usuario.
     * @returns Devuelve el usuario deshabilitado.
     */
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