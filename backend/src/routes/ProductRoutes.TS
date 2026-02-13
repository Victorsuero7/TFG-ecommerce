import { Router } from 'express';
import { ProductServiceImpl } from '../services/ProductServiceImpl';
import { ProductRepository } from '../repositories/ProductRepository';
import { ProductController } from '../controllers/ProductController';
import { MySQLDataSource } from '../config/MySQL-datasource';
import { ImageUploaderMiddleware } from '../utils/ImageUploaderMiddleware';

const imageHandler = ImageUploaderMiddleware.create("products")

export class ProductRoutes {
    static get routes(): Router {
        const router = Router();
        const repository = new ProductRepository(MySQLDataSource);
        const service = new ProductServiceImpl(repository);
        const controller = new ProductController(service);

        router.post('/insert', imageHandler.single("image"), controller.insert)
        router.patch('/update', controller.update)
        router.patch('/update/many', controller.updateMany)
        router.get('/', controller.getAll)
        router.get('/all', controller.getAll)
        router.get('/all/:page', controller.getAllPaginated)
        router.get('/name/:name', controller.getByName)
        router.get('/category/:id', controller.byCategory)
        router.get('/category-name/:categoryName', controller.getByCategoryName)
        router.get('/description/:description', controller.getByDescription)
        router.get('/stock/:min/:max', controller.getByStock)
        router.get('/:id', controller.getOne)
        // router.post('/update', controller.update)

        return router;
    }
}
