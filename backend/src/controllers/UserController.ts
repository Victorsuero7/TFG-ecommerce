import e, { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { HttpErrors } from '../utils/HttpErrors';
import { RegisterUserDTO } from '../dtos/RegisterUserDTO';
import { LoginUserDTO } from '../dtos/LoginUserDTO';
import { UserDTO } from '../dtos/UserDTO';
import { CategoryDTO } from '../dtos/CategoryDTO';
import { error } from 'console';

/**
 * Controlador encargado de gestionar usuarios y autenticación.
 */
export class UserController {

    /**
     * Constructor del controlador.
     * @param service Servicio de usuarios.
     */
    constructor(service: UserService) {
        this.service = service;
    }
    private readonly service: UserService;

    /**
     * Crea un nuevo usuario.
     * @param req Contiene los datos del usuario en el body.
     * @param res Respuesta HTTP.
     * @returns Devuelve respuesta HTTP: 200 con mensaje y usuario registrado o
     * 500 si hay error.
     */
    insert = async (req: Request, res: Response) => {
        try {
            const dto = UserDTO.createDTO(req.body)
            const result = await this.service.insert(dto)
            return res.status(200).json({ message: "User saved", user: result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    /**
     * Obtiene un usuario por identificador
     */
    getOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const result = await this.service.getOne(Number(id))
            res.status(200).json({ message: result })
        } catch (error) {
            if (error instanceof HttpErrors) res.status(error.statusCode).json({ message: error.message })
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    /**
     * Obtiene usuarios paginados.
     */
    getAllPaginated = async (req: Request, res: Response) => {
        try {
            const page = Number(req.params.page ?? 1);
            const response = await this.service.getAllPaginated(page);
            return res.status(200).json({
                data: response.result,
                totalCount: response.metadata?.count ?? 0,
            });
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    /**
    * Autentica un usuario en el sistema.
    *
    * Este endpoint valida las credenciales recibidas en el body de la petición,
    * genera un token de autenticación (normalmente JWT) a través del servicio
    * y lo devuelve tanto en la respuesta como en una cookie HTTP.
    *
    * Flujo:
    * 1. Se valida el body mediante {@link LoginUserDTO}.
    * 2. Se delega la autenticación al servicio.
    * 3. Si es correcta, se genera un token.
    * 4. El token se envía en una cookie y en el body de la respuesta.
    *
    * @param req Objeto de petición HTTP que contiene las credenciales del usuario (email, password).
    * @param res Objeto de respuesta HTTP utilizado para devolver el resultado de la autenticación.
    *
    * @returns Respuesta HTTP:
    * - 200: Login correcto. Devuelve token y establece cookie de sesión.
    * - 400: Credenciales inválidas o error de validación.
    * - 500: Error interno del servidor.
    *
    * @remarks
    * - La cookie "token" tiene una duración de 84.000.000 ms (~23 horas).
    * - Actualmente no se define redirección tras login (pendiente de implementación).
    *
    * @throws {@link HttpErrors} Cuando las credenciales no son válidas o falla la autenticación.
    */
    login = async (req: Request, res: Response) => {
        try {
            const [err, dto] = LoginUserDTO.create(req.body)
            if (err) return res.status(400).json({ message: err })
            const result = await this.service.login(dto!)

            if (result) {
                return res.cookie("token", result, { maxAge: 84000000 }).status(200).json({ message: 'Login succesfully', token: result })
            }
            //TODO
            //Pendiente redireccionar a la home o alguna pagina por determinar
        }
        catch (error) {
            if (error instanceof HttpErrors) return res.status(400).json({ message: "Invalid credentials" })
            console.error('ERROR EN EL CONTROLLER:', error);
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    /**
    * Registra un nuevo usuario en el sistema y realiza login automático.
    *
    * Este endpoint crea un nuevo usuario a partir de los datos recibidos en el body
    * de la petición. Si el registro es exitoso, reutiliza el flujo de autenticación
    * llamando internamente al método {@link login}, generando así el token de sesión.
    *
    * Flujo:
    * 1. Se validan los datos de entrada mediante {@link RegisterUserDTO}.
    * 2. Se crea el usuario a través del servicio.
    * 3. Si el registro es correcto, se ejecuta automáticamente el login.
    * 4. Se devuelve el token de autenticación en cookie y en la respuesta.
    *
    * @param req Objeto de petición HTTP que contiene los datos de registro (email, password, etc.).
    * @param res Objeto de respuesta HTTP utilizado para devolver el resultado.
    *
    * @returns Respuesta HTTP:
    * - 200: Usuario registrado y autenticado correctamente.
    * - 400: Error de validación en los datos de entrada.
    * - 5xx: Error interno del servidor.
    *
    * @remarks
    * - Este método reutiliza la lógica de {@link login}, evitando duplicación de código.
    * - El token de autenticación se gestiona en el método login (cookie + JSON).
    *
    * @throws {@link HttpErrors} Cuando ocurre un error en la creación del usuario.
    */
    signUp = async (req: Request, res: Response) => {
        try {
            const [err, dto] = RegisterUserDTO.create(req.body)
            if (err) {
                return res.status(400).json({ message: err })
            }
            const result = await this.service.signUp(dto!)
            return this.login(req, res)
        } catch (error) {
            if (error instanceof HttpErrors) res.status(error.statusCode).json({ message: error.message })
            console.log(error);
            res.status(500).json({ message: "Internal server error" })
        }
    }

    /**
     * Valida si un email ya existe.
     */
    validateEmail = async (req: Request, res: Response) => {
        try {
            const email = String(req.query.email)
            if (!email) return res.status(400).json({ error: "missing email" })
            const result = await this.service.emailExists(email)
            if (!result) return res.status(200).json({ result: "email available" })
        } catch (error) {
            if (error instanceof HttpErrors) res.status(error.statusCode).json({ message: error.message })
            // console.log(error);
            res.status(500).json({ message: "Internal server error" })
        }
    }

    /**
     * Elimina (deshabilita) un usuario.
     */
    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            if (!id) return res.status(400).json({ message: "Missing params" })
            const result = await this.service.delete(Number(id))
            if (result)
                res.status(200).json({ result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    /**
     * Obtiene una lista de usuarios deshabilitados. 
     */
    disabled = async (req: Request, res: Response) => {
        try {
            const page = Number(req.params.page) ?? 1
            const result = await this.service.listDisabled(page)
            res.status(200).json({ result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }
}