import { Router } from 'express';
import { CategoryServiceImpl } from '../services/CategoryServiceImpl';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { CategoryController } from '../controllers/CategoryController';
import { MySQLDataSource } from '../config/MySQL-datasource';

export class CategoryRoutes {
    static get routes(): Router {
        const router = Router();
        const repository = new CategoryRepository(MySQLDataSource);
        const service = new CategoryServiceImpl(repository);
        const controller = new CategoryController(service);

        router.post('/insert', controller.insert)
        router.patch('/update', controller.update)
        router.get('/', controller.getAll)
        router.get('/all', controller.getAll)
        router.get('/name/:name', controller.getByName)
        router.get('/description/:description', controller.getByDescription)
        router.get('/all/:page', controller.getAllPaginated)
        router.get('/:id', controller.getOne)

        return router;
    }
}