import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../Models/user.entity';
import { HttpErrors } from '../utils/HttpErrors';

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
                message: HttpErrors.badRequest("Error en la operación",)
            });
        }
    }


    getOne = async (req: Request, res: Response) => {
        const id = req.params.id
        const result = await this.service.getOne(Number(id))
        if (result != null) {
            res.status(200).json({ message: result })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    }
    getAll = async (req: Request, res: Response) => {
        const result = await this.service.getAll()
        res.status(200).json({ message: result })
    }
}
