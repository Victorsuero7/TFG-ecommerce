import { Request, Response } from "express";
import { MovementService } from "../services/MovementService";
import { HttpErrors } from "../utils/HttpErrors";

export class MovementController {
    private readonly service: MovementService;
    constructor(service: MovementService) {
        this.service = service;
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getAll();
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message });
            return res.status(500).json({ message: "Error del servidor" });
        }
    }
}
