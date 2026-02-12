import { Router } from 'express';
import { ProductServiceImpl } from '../services/ProductServiceImpl';
import { ProductRepository } from '../repositories/ProductRepository';
import { ProductController } from '../controllers/ProductController';
import { MySQLDataSource } from '../config/MySQL-datasource';

export class ProductRoutes {
    static get routes(): Router {
        const router = Router();
        const repository = new ProductRepository(MySQLDataSource);
        const service = new ProductServiceImpl(repository);
        const controller = new ProductController(service);

        router.post('/insert', controller.insert)
        router.patch('/update', controller.update)
        router.get('/', controller.getAll)
        router.get('/all', controller.getAll)
        router.get('/all/:page', controller.getAllPaginated)
        router.get('/:id', controller.getOne)
        router.post('/update', controller.update)
        router.get('/stock', controller.getByStock) // ?from = number to?=number ?page = page


        return router;
    }
}
