import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../Models/user.entity';
import { HttpErrors } from '../utils/HttpErrors';
import * as bcrypt from 'bcrypt';
import { JWTAdapter } from '../utils/Jwt';
import { RegisterUserDTO } from '../dtos/RegisterUserDTO';

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
            const { email, password } = req.body
            let validPassword!: boolean
            let user!: User | null

            if (email) {
                user = await this.service.findByEmail(email)
                if (!user) {
                    return res.status(400).json({ message: "Invalid credentials" })
                }
            }
            validPassword = await bcrypt.compare(password, user!.password)
            if (validPassword) {
                const token = await JWTAdapter.generateToken({ id: user!.id, name: user!.name, role: user!.role }, '2h')
                // res.status(200).json({ message: 'Login succesfully', token: token }).cookie("token", token, { maxAge: 84000000 })
                return res.status(200).json({ message: 'Login succesfully', token: token })

                //TODO
                //Pendiente redireccionar a la home o alguna pagina por determinar
            }
            return res.status(400).json({ message: "Invalid credentials" })

        } catch (error) {
            console.error('ERROR EN EL CONTROLLER:', error);
            res.status(500).json({ message: "Internal Server Error" })
        }
    }


    signUp = async (req: Request, res: Response) => {
        try {
            console.log(req.body);
            const { name, lastName, phoneNumber, email, password, birthDate } = req.body
            const user = new User()
            user.email = email
            user.name = name
            user.lastName = lastName
            user.phoneNumber = phoneNumber
            // user.birthDate = birthDate

            const salt = bcrypt.genSaltSync(5);
            let hash = bcrypt.hashSync(password, salt)

            user.password = hash
            const userExists = await this.service.findByEmail(email)
            if (userExists) {
                return res.status(500).json({ message: 'User alredy exists' })
            }

            const userRegistered = await this.service.insert(user)
            if (!userRegistered) {
                return res.status(500).json({ message: 'Something went wrong' })
            }
            this.login(req, res)

        } catch (error) {
            console.error('ERROR EN EL CONTROLLER:', error);
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}
