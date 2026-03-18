import { Request, Response } from 'express';
import { MovementService } from "../services/MovementService";
import { HttpErrors } from '../utils/HttpErrors';


/**
 * Controlador encargado de gestionar los movimientos del sistema.
 */
export class MovementController {

    /**
     * Constructor del controlador.
     * @param service Servicio de movimientos.
     */
    constructor(service: MovementService) {
        this.service = service;
    }
    private readonly service: MovementService;

    /**
     * Obtiene todos los movimientos de forma paginada.
     *
     * El número de página puede recibirse tanto por query params como por params de ruta.
     *
     * @param req Objeto de petición HTTP que puede contener el número de página en query o params.
     * @param res Objeto de respuesta HTTP.
     *
     * @returns Respuesta HTTP:
     * - 200: Lista paginada de movimientos.
     * - 400: Parámetro de página inválido.
     * - 500: Error interno del servidor.
     */
    getAll = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page ?? req.params.page ?? 1)
            if (isNaN(page) || page < 1) return res.status(400).json({ message: "Page required" })
            const result = await this.service.getAllPaginated(page)
            return res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    /**
     * Busca movimientos en función de múltiples criterios.
     *
     * Permite filtrar por distintos parámetros opcionales recibidos en la query:
     * - page: número de página
     * - userId: ID del usuario
     * - productId: ID del producto
     * - productName: nombre del producto
     * - from: fecha inicial
     * - to: fecha final
     *
     * @param req Objeto de petición HTTP que contiene los filtros en los query params.
     * @param res Objeto de respuesta HTTP.
     *
     * @returns Respuesta HTTP:
     * - 200: Lista de movimientos filtrados.
     * - 500: Error interno del servidor.
     *
     * @remarks
     * - Todos los parámetros son opcionales.
     * - La lógica de filtrado se delega completamente al servicio.
     */
    findBy = async (req: Request, res: Response) => {
        try {
            const params: any = {
                page: req.query.page ?? 1,
                userId: req.query.user,
                productId: req.query.product,
                productName: req.query.name,
                from: req.query.from,
                to: req.query.to,
            }
            // console.log("PARAMS: ", params);
            // if (params.page < 1) return res.status(400).json({ message: "Page required" })
            const result = await this.service.getByQueryParams(params)
            return res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            res.status(500).json({ message: "Internal Server Error" })
        }
    }


}