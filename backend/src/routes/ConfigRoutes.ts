import { Router } from 'express';
import { ConfigController } from '../controllers/ConfigController';

export class ConfigRoutes {
    static get routes(): Router {
        const router = Router();
        router.get('/', ConfigController.getConfig);
        return router;
    }
}
