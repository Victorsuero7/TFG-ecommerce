import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { HttpErrors } from '../utils/HttpErrors';
import { ProductDTO } from '../dtos/ProductDTO';
import { getPath } from '../utils/ImageUploaderMiddleware';
import { CategoryDTO } from '../dtos/CategoryDTO';

export class ProductController {
    constructor(service: ProductService) {
        this.service = service;
    }
    private readonly service: ProductService;

    insert = async (req: Request, res: Response) => {
        try {
            // console.log("ruta del archivo ", req.file?.path);
            const dto = ProductDTO.createDTO(req.body)
            dto.modifiedBy = req.user?.id
            dto.imageUrl = getPath(req.file?.path!)
            const result = await this.service.insert(dto)
            res.status(200).json(result)
        } catch (error) {
            console.log(error);
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500).json({ message: error })
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const dto = ProductDTO.createDTO(req.body)
            dto.modifiedBy = req.user.id
            const result = await this.service.update(dto)
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500).json({ message: "error.message" })
        }
    }

    updateMany = async (req: Request, res: Response) => {
        try {
            const objects: object[] = req.body.array
            const dtos = objects.map(e => ProductDTO.createDTO(e, getPath(req.file?.path!)))
            dtos.forEach(e => e.modifiedBy = req.user.id)
            const result = this.service.updateMany(dtos)
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
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getAll()
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getAllPaginated = async (req: Request, res: Response) => {
        try {
            const page = req.params.page!
            const result = await this.service.getAllPaginated(Number.parseInt(page))
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getByStock = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page)
            const from = Number(req.query.stock)
            const to = Number(req.query.rule)
            if (!page || !from || !to) return res.status(400).json({ error: "Some mistakes on params" })
            const result = await this.service.filterByStock(from, to, page ?? 1)
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
            const result = await this.service.getByName(name)
            return res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getByDescription = async (req: Request, res: Response) => {
        try {
            const description = req.params.description
            if (!description) return res.status(400).json({ message: 'description parameter is required' })
            const result = await this.service.getByDescription(description)
            return res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    getByCategoryName = async (req: Request, res: Response) => {
        try {
            const categoryName = req.params.categoryName
            if (!categoryName) return res.status(400).json({ message: 'categoryName parameter is required' })
            const result = await this.service.getByCategoryName(categoryName)
            return res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

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
    byCategory = async (req: Request, res: Response) => {
        try {
            const page = req.params.pge ? Number(req.query.page) : 1
            const id = Number(req.params.id)
            const dto = new CategoryDTO()
            dto.id = id
            const result = await this.service.findByCategory(dto, page)
            res.status(200).json({ result })
        } catch (error) {
            if (error instanceof HttpErrors) res.status(error.statusCode).json({ message: error.message })
            res.status(500).json({ message: "Internal server error" })
        }
    }

}
