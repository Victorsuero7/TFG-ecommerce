import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { HttpErrors } from '../utils/HttpErrors';
import { CategoryDTO } from '../dtos/CategoryDTO';

/**
 * Controlador encargado de gestionar las operaciones relacionadas con categorías.
 * Actúa como intermediario entre la capa HTTP y la capa de servicios.
 */
export class CategoryController {

    /**
     * Inyección del servicio para categorías.
     * @param service Servicio de categoría.
     */
    constructor(service: CategoryService) {
        this.service = service;
    }
    private readonly service: CategoryService;

    /**
     * Crea una nueva categoría.
     * Recibe los datos de la categoría a través del body de la petición,
     * los transforma en un DTO y delega la creación al servicio correspondiente.
     * 
     * @param req Objeto de petición HTTP con los datos de la categoría.
     * @param res Objeto de respuesta HTTP utilizado para devolver el resultado
     * de la operación.
     * @returns Devuelve una respuesta HTTP: 200 para categoría creada correctamente
     * y 500 por error en la validación o ejecución del servicio.
     */
    insert = async (req: Request, res: Response) => {
        try {
            const dto = CategoryDTO.createDTO(req.body)
            const result = await this.service.insert(dto)
            res.status(200).json({ message: "Category saved", category: result })

        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    /**
     * Actualiza una categoría existente.
     * @param req Objeto de petición HTTP con los datos actualizados en el body.
     * @param res Objeto de respuesta HTTP.
     * @returns Devuelve una respuesta HTTP: 200 con la categoría actualizada o 500 si hay error.
     */
    update = async (req: Request, res: Response) => {
        try {
            const dto = CategoryDTO.createDTO(req.body)
            const result = await this.service.update(dto)
            res.status(200).json({ message: "Category updated", category: result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    /**
     * Obtiene una categoría por su identificador.
     * @param req Objeto de petición HTTP con id de la categoría.
     * @param res Objeto de respuesta HTTP.
     * @returns Devuelve respuesta HTTP: 200 con la categoría actualizada o 500 si hay error.
     */
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

    /**
     * Obtiene todas las categorías.
     * @param req Objeto de petición HTTP.
     * @param res Objeto de respuesta HTTP.
     * @returns Devuelve respuesta HTTP: 200 con la lista o 500 si hay error.
     */
    getAll = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getAll()
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    /**
     * Obtiene una categoría por nombre.
     * @param req Objeto de petición HTTP con el nombre de la categoría.
     * @param res Objeto de respuesta HTTP.
     * @returns Devuelve respuesta HTTP: 200 con la categoría encontrada o 500 si hay error.
     */
    getByName = async (req: Request, res: Response) => {
        try {
            const name = req.params.name
            if (!name) return res.status(400).json({ message: 'name parameter is required' })
            const result = await this.service.findByName(name)
            if (result != null) return res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    /**
     * Obtiene una categoría por descripción.
     * @param req Objeto de petición HTTP con el texto a buscar.
     * @param res Objeto de respuesta HTTP.
     * @returns Devuelve respuesta HTTP: 400 si el param está vacío,
     * 200 con la categoría encontrada y 500 si hay error.
     */
    getByDescription = async (req: Request, res: Response) => {
        try {
            const description = req.params.description
            if (!description) return res.status(400).json({ message: 'description parameter is required' })
            const result = await this.service.findByDescription(description)
            if (result != null) return res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    /**
     * Obtiene todas las categorías con paginación.
     * @param req Contiene el número de página en los params.
     * @param res Respuesta HTTP.
     * @returns Devuelve respuesta HTTP: 200 con la lista de categorías y 
     * 500 si hay error.
     */
    getAllPaginated = async (req: Request, res: Response) => {
        try {
            const page = req.params.page!
            const result = await this.service.getAllPaginated(Number.parseInt(page))
            res.status(200).json({ message: result })
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
        }
    }

    /**
     * Deshabilita una categoría.
     * @param req Objeto de petición HTTP con el id de la categoría.
     * @param res Objeto de respuesta HTTP.
     * @returns Devuelve respuesta HTTP: 200 si se ha eliminado y 
     * 500 si hay error.
     */
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
}