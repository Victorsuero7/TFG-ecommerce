import { Router } from 'express';
import { MovementServiceImpl } from '../services/MovementServiceImpl';
import { MovementRepository } from '../repositories/MovementRepository';
import { MovementController } from '../controllers/MovementController';
import { MySQLDataSource } from '../config/MySQL-datasource';

export class MovementRoutes {
    static get routes(): Router {
        const router = Router();
        const repository = new MovementRepository(MySQLDataSource);
        const service = new MovementServiceImpl(repository);
        const controller = new MovementController(service);

        router.get('/', controller.getAll);
        router.get('/all', controller.getAll);

        return router;
    }
}
