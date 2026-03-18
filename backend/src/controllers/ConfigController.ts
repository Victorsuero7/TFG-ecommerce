import { Request, Response } from 'express';
import { envs } from '../config/envs';

/**
 * Controlador encargado de exponer configuraciones del sistema.
 */
export class ConfigController {

    /**
     * Obtiene la configuración global del sistema.
     * @param req Objeto de petición HTTP.
     * @param res Objeto de respuesta HTTP.
     * 
     * @returns Configuración disponible para el cliente.
     */
    static getConfig = (req: Request, res: Response) => {
        res.json({ productsPerPage: envs.PRODUCTS_PER_PAGE });
    };
}
