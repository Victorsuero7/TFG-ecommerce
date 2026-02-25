import { Request, Response } from 'express';
import { HttpErrors } from '../utils/HttpErrors';
import { RefreshTokenServiceImpl } from '../services/RefreshTokenService';

export class RefreshTokenController {
    constructor(service: RefreshTokenServiceImpl) {
        this.service = service;
    }
    private readonly service: RefreshTokenServiceImpl;

    refreshAccess = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.headers["x-refresh-token"] as string;

            const { jwt, refresh } = await this.service.refreshAccess(refreshToken)

            res.status(200).json({ jwt, refresh })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

}