import { Request, Response } from 'express';
import { envs } from '../config/envs';

export class ConfigController {
    static getConfig = (req: Request, res: Response) => {
        res.json({ productsPerPage: envs.PRODUCTS_PER_PAGE });
    };
}
