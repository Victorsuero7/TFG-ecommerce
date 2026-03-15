import { Router } from 'express';
import { UserServiceImpl } from '../services/UserServiceImpl';
import { UserRepository } from '../repositories/UserRepository';
import { UserController } from '../controllers/UserController';
import { MySQLDataSource } from '../config/MySQL-datasource';
import { RBACMiddleware } from '../utils/AuthorizationMiddleware';

export class UserRoutes {
    static get routes(): Router {
        const router = Router();
        const repository = new UserRepository(MySQLDataSource);
        const service = new UserServiceImpl(repository);
        const controller = new UserController(service);

        router.post('/login', controller.login)
        router.post('/sign-up', controller.signUp)

        router.use(RBACMiddleware.requireAutentication())

        router.post('/insert', controller.insert)
        router.get('/', controller.getAllPaginated)
        router.get('/all/:page', controller.getAllPaginated)
        router.get('/email-available', controller.validateEmail) //?email=
        router.get('/:id', controller.getOne)
        router.delete('/delete/:id', RBACMiddleware.requireRole(["ADMIN", "ROOT"]), controller.delete)
        router.get('/disabled/:page', RBACMiddleware.requireRole(["ADMIN", "ROOT"]), controller.disabled)


        // router.post('/register', controller.registerUser)

        // router.get('/users', [AuthMiddleware.validateJWT], controller.getUsers)

        return router;
    }
}
