import { Router } from 'express'
import { MySQLDataSource } from '../config/MySQL-datasource';
import { MovementRepository } from '../repositories/MovementsRepository';
import { MovementServiceImpl } from '../services/MovementServiceImpl';
import { MovementController } from '../controllers/MovementController';


export class MovementsRoutes {
    static get routes(): Router {
        const router = Router();
        const repository = new MovementRepository(MySQLDataSource);
        const service = new MovementServiceImpl(repository);
        const controller = new MovementController(service);

        router.get('/all/:page', controller.getAll)
        router.get('/find', controller.findBy) //accept this params ?page, ?user (id), ?product (id), ?from, ?to //both dates required in fomrat YYYY-mm-dd

        return router
    }

}