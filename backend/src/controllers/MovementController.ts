import { Request, Response } from 'express';
import { MovementService } from "../services/MovementService";
import { HttpErrors } from '../utils/HttpErrors';


export class MovementController {
    constructor(service: MovementService) {
        this.service = service;
    }
    private readonly service: MovementService;

    getAll = async (req: Request, res: Response) => {
        try {
            const page = Number(req.params.page)
            if (page < 1) return res.status(400).json({ message: "Page required" })
            const result = await this.service.getAllPaginated(page)
            return res.status(200).json({ message: result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    findBy = async (req: Request, res: Response) => {
        try {
            const params: any = {
                page: Number(req.query.page ?? 1),
                userId: Number(req.query.user),
                productId: Number(req.query.produt),
                from: req.query.from ?? undefined,
                to: req.query.to ?? undefined,
            }
            console.log("PARAMS: ", params);
            // if (params.page < 1) return res.status(400).json({ message: "Page required" })
            const result = await this.service.getByQueryParams(params)
            return res.status(200).json({ message: result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            res.status(500).json({ message: "Internal Server Error" })
        }
    }


}