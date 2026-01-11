import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { Category } from '../Models/category.entity';
import { HttpErrors } from '../utils/HttpErrors';

export class CategoryController {
    constructor(service: CategoryService) {
        this.service = service;
    }
    private readonly service: CategoryService;

    insert = async (req: Request, res: Response) => {
        try {
            const payload = req.body as Partial<Category>;
            const category = new Category();
            Object.assign(category, payload);

            const result = await this.service.insert(category)
            res.status(200).json({ message: 'ruta exitosa', content: result })

        } catch (e: any) {
            console.error('ERROR EN EL CONTROLLER:', e);
            return res.status(400).json({
                message: HttpErrors.badRequest('Error en la operación')
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

    getByName = async (req: Request, res: Response) => {
        const name = req.params.name
        if (!name) {
            return res.status(400).json({ message: 'name parameter is required' })
        }
        const result = await this.service.findByName(name)
        if (result != null) {
            res.status(200).json({ message: result })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    }

    getByDescription = async (req: Request, res: Response) => {
        const description = req.params.description
        if (!description) {
            return res.status(400).json({ message: 'description parameter is required' })
        }
        const result = await this.service.findByDescription(description)
        if (result != null) {
            res.status(200).json({ message: result })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    }
}
