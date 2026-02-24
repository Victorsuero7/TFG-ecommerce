import e, { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { HttpErrors } from '../utils/HttpErrors';
import { RegisterUserDTO } from '../dtos/RegisterUserDTO';
import { LoginUserDTO } from '../dtos/LoginUserDTO';
import { UserDTO } from '../dtos/UserDTO';
import { CategoryDTO } from '../dtos/CategoryDTO';
import { error } from 'console';

export class UserController {
    constructor(service: UserService) {
        this.service = service;
    }
    private readonly service: UserService;

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

    getAll = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getAll()
            res.status(200).json({ message: result })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

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
}