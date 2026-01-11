import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { Product } from '../Models/product.entity';
import { HttpErrors } from '../utils/HttpErrors';

export class ProductController {
    constructor(service: ProductService) {
        this.service = service;
    }
    private readonly service: ProductService;

    insert = async (req: Request, res: Response) => {
        try {
            const payload = req.body as Partial<Product>;
            const product = new Product();
            Object.assign(product, payload);

            const result = await this.service.insert(product)
            res.status(200).json({ message: 'ruta exitosa', content: result })

        } catch (e: any) {
            console.error('ERROR EN EL CONTROLLER:', e);
            return res.status(400).json({
                message: HttpErrors.badRequest('Error en la operación')
            });
        }
    }

    getOne = async (req: Request, res: Response) => {
        const id = req.params.id
        const result = await this.service.getById(Number(id))
        if (result != null) {
            res.status(200).json({ message: result })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    }

    getAll = async (req: Request, res: Response) => {
        const result = await this.service.getAll()
        console.log('Products fetched:', result.map(p => ({ id: p.id, name: p.name, category: (p as any).category ? { id: (p as any).category.id, name: (p as any).category.name } : null })));
        res.status(200).json({ message: result })
    }
}
