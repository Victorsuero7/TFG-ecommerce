import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { HttpErrors } from '../utils/HttpErrors';
import { CategoryDTO } from '../dtos/CategoryDTO';

export class CategoryController {
    constructor(service: CategoryService) {
        this.service = service;
    }
    private readonly service: CategoryService;

    insert = async (req: Request, res: Response) => {
        try {
            const dto = CategoryDTO.createDTO(req.body)
            const result = await this.service.insert(dto)
            res.status(200).json({ category: result })

        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const result = await this.service.getById(Number(id))
            res.status(200).json({ category: result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getAll()
            res.status(200).json({ message: result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getByName = async (req: Request, res: Response) => {
        try {
            const name = req.params.name
            if (!name) return res.status(400).json({ message: 'name parameter is required' })
            const result = await this.service.findByName(name)
            if (result != null) return res.status(200).json({ message: result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getByDescription = async (req: Request, res: Response) => {
        try {
            const description = req.params.description
            if (!description) return res.status(400).json({ message: 'description parameter is required' })
            const result = await this.service.findByDescription(description)
            if (result != null) return res.status(200).json({ message: result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }
}