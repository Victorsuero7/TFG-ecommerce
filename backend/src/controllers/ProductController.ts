import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { HttpErrors } from '../utils/HttpErrors';
import { ProductDTO } from '../dtos/ProductDTO';

export class ProductController {
    constructor(service: ProductService) {
        this.service = service;
    }
    private readonly service: ProductService;

    insert = async (req: Request, res: Response) => {
        try {
            const dto = ProductDTO.createDTO(req.body)
            const result = await this.service.insert(dto)
            res.status(200).json({ result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const dto = ProductDTO.createDTO(req.body)
            const result = await this.service.update(dto)
            res.status(200).json({ result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            if (!id) return res.status(400).json({ message: "ID param is required" })
            const result = await this.service.getById(Number(id))
            res.status(200).json({ result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getAll()
            res.status(200).json({ result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getAllPaginated = async (req: Request, res: Response) => {
        try {
            const page = req.params.page!
            const result = await this.service.getAllPaginated(Number.parseInt(page))
            res.status(200).json({ result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            if (!id) return res.status(400).json({ message: "ID param is required" })
            const result = await this.service.update(Number(id), req.body)
            res.status(200).json({ message: "Product updated", product: result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }
}
