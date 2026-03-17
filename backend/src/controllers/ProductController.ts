import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { HttpErrors } from '../utils/HttpErrors';
import { ProductDTO } from '../dtos/ProductDTO';
import { getPath } from '../utils/ImageUploaderMiddleware';
import { CategoryDTO } from '../dtos/CategoryDTO';

/**
 * Controlador encargado de gestionar las operaciones relacionadas con productos.
 */
export class ProductController {

    /**
     * Constructor del controlador.
     * @param service Servicio de productos.
     */
    constructor(service: ProductService) {
        this.service = service;
    }
    private readonly service: ProductService;

    /**
     * Crea un producto.
     * @param req Contiene los datos del producto y el archivo de imagen.
     * @param res Respuesta HTTP.
     * @returns Devuelve respuesta HTTP: 200 con el producto creado y 
     * 500 si hay error.
     */
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

    /**
     * Actualiza un producto existente.
     * @param req Contiene los datos que queremos actualizar y una imagen opcional.
     * @param res Respuesta HTTP.
     * @returns Devuelve respuesta HTTP: 200 con el producto actualizado y 500 si hay error.
     */
    update = async (req: Request, res: Response) => {
        try {
            const dto = ProductDTO.createDTO(req.body)
            // dto.modifiedBy = req.user.id ?? undefined
            dto.imageUrl = getPath(req.file?.path!)
            const result = await this.service.update(dto)
            res.status(200).json(result)
        } catch (error) {
            console.log(error);
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500).json({ message: error })
        }
    }

    /**
     * Actualiza varios productos en una sola operación.
     * @param req Contiene un array de productos.
     * @param res Respuesta HTTP.
     * @returns Devuelve una respuesta HTTP: 200 con los productos actualizados y 500 si hay error.
     */
    updateMany = async (req: Request, res: Response) => {
        try {
            // console.log('[updateMany] req.body:', JSON.stringify(req.body));
            const objects: object[] = Array.isArray(req.body) ? req.body : req.body.array;
            // console.log('[updateMany] objects to update:', objects?.length);
            const dtos = objects.map(e => ProductDTO.createDTO(e))
            dtos.forEach(e=>e.modifiedBy = req.user?.id)
            // console.log('[updateMany] dtos created:', dtos.length);
            const result = await this.service.updateMany(dtos)
            // console.log('[updateMany] result:', JSON.stringify(result));
            res.status(200).json({ result })
        } catch (error) {
            console.error('[updateMany] error:', error);
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    /**
     * Obtiene un producto por su identificador.
     * @param req Contiene el identificador único del producto.
     * @param res Respuesta HTTP.
     * @returns Devuelve una respuesta HTTP: 200 con el producto encontrado o null y 500 si hay error.
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
     * Obtiene todos los productos.
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
     * Obtiene todos los productos con paginación.
     */
    getAllPaginated = async (req: Request, res: Response) => {
        try {
            const page = Number(req.params.page ?? 1);
            const response = await this.service.getAllPaginated(page);
            console.log("response from getAllPaginated ", response);
            return res.status(200).json({
                data: response.result,
                totalCount: response.metadata?.count ?? 0,
            });
        } catch (error) {
            if (error instanceof HttpErrors) return res.status(error.statusCode).json({ message: error.message })
            return res.status(500)
        }
    }

    /**
     * Obtiene productos filtrados por su stock.
     */
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

    /**
     * Busca productos por nombre.
     */
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

    /**
     * Obtiene productos por descripción.
     */
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

    /**
     * Obtiene productos por el nombre de la categoría.
     */
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

    /**
     * Deshabilita un producto.
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

    /**
     * Obtiene una lista de productos deshabilitados.
     */
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

    /**
     * Obtiene productos por categoría.
     */
    byCategory = async (req: Request, res: Response) => {
        try {
            const page = req.params.pge ? Number(req.query.page) : 1;
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Parámetro de categoría inválido' });
            }
            const dto = new CategoryDTO();
            dto.id = id;
            const result = await this.service.findByCategory(dto, page);
            res.status(200).json({ result });
        } catch (error) {
            if (error instanceof HttpErrors) res.status(error.statusCode).json({ message: error.message });
            else res.status(500).json({ message: "Internal server error" });
        }
    }

}
