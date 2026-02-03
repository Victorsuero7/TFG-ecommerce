import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../Models/user.entity';
import { HttpErrors } from '../utils/HttpErrors';
import { RegisterUserDTO } from '../dtos/RegisterUserDTO';
import { LoginUserDTO } from '../dtos/LoginUserDTO';

export class UserController {
    constructor(service: UserService) {
        this.service = service;
    }
    private readonly service: UserService;

    // getUsers = async (req: Request, res: Response) => {
    //     try {
    //         const result = await this.service.findAll();
    //         res.status(200).json({
    //             title: 'Users List',
    //             content: result,
    //         });
    //     } catch (error) {
    //         res.status(500).json({ error: 'Something went wrong' });
    //     }
    // };

    insert = async (req: Request, res: Response) => {
        try {
            const { name, lastName, phoneNumber, email } = req.body
            const user = new User()
            user.name = name
            user.lastName = lastName
            user.phoneNumber = phoneNumber
            user.email = email

            const result = await this.service.insert(user)
            res.status(200).json({ message: 'ruta exitosa', content: result })

        } catch (e: any) {

            console.error('ERROR EN EL CONTROLLER:', e);
            if (e.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    err: 'Usuario ya existe'
                })
            }
            return res.status(400).json({
                message: HttpErrors.badRequest("Error en la operación")
            });
        }
    }


    getOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const result = await this.service.getOne(Number(id))
            if (result != null) {
                res.status(200).json({ message: result })
            } else {
                res.status(404).json({ message: 'not found' })
            }
        } catch (error) {
            console.error('ERROR EN EL CONTROLLER:', error);
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getAll()
            res.status(200).json({ message: result })
        } catch (error) {
            console.error('ERROR EN EL CONTROLLER:', error);
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const [err, dto] = LoginUserDTO.create(req.body)
            if (err) res.status(400).json({ message: err })
            const result = await this.service.login(dto!)

            if (result) {
                res.status(200).json({ message: 'Login succesfully', token: result }).cookie("token", result, { maxAge: 84000000 })
            }
            //TODO
            //Pendiente redireccionar a la home o alguna pagina por determinar
        }
        catch(error) {
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
        this.login(req, res)
        // return res.status(200).json({ message: result })
    } catch (error) {
        if (error instanceof HttpErrors) res.status(error.statusCode).json({ message: error.message })
        console.error('ERROR EN EL CONTROLLER:', error);
        res.status(500).json({ message: "Internal server error" })
    }
}
}