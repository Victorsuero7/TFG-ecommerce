import request from 'supertest';
import { DataSource } from 'typeorm';
import { app } from '../src/app';
import { Category } from '../src/Models/category.entity';
import { Product } from '../src/Models/product.entity';
import { User } from '../src/Models/user.entity';
// Importamos tu generador de tokens real
import { JWTAdapter } from '../src/utils/Jwt';

// 1. Configuramos la BD de prueba (Igual que antes)
const TestDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [Category, Product, User], // Añadimos User
    synchronize: true,
    logging: false,
});

jest.mock('../src/config/MySQL-datasource', () => ({
    MySQLDataSource: TestDataSource
}));

// ¡FÍJATE QUE AQUÍ NO MOCKEAMOS EL RBACMiddleware! 
// Queremos que actúe de verdad.

describe('Authentication Integration Tests (Category Routes)', () => {

    beforeAll(async () => {
        await TestDataSource.initialize();

        // Preparamos una categoría de prueba en la BD
        const categoryRepo = TestDataSource.getRepository(Category);
        await categoryRepo.save({ name: 'Security', description: 'Test' });
    });

    afterAll(async () => {
        await TestDataSource.destroy();
    });

    describe('Security checks', () => {

        it('should return 401/403 (Unauthorized) if NO TOKEN is provided', async () => {
            // Intentamos acceder a las categorías SIN enviar cabecera de Autorización
            const response = await request(app).get('/category/');

            // Dependiendo de cómo tengas hecho tu RBACMiddleware, devolverá 401 o 403
            expect(response.status).toBe(401);
            // expect(response.body.message).toBe('Token missing'); // (Opcional) valida tu mensaje de error
        });

        it('should return 401/403 if an INVALID TOKEN is provided', async () => {
            // Intentamos acceder con un token inventado
            const response = await request(app)
                .get('/category/')
                .set('Authorization', 'Bearer token-falso-12345');

            expect(response.status).toBe(401);
        });

        it('should return 200 OK if a VALID TOKEN is provided', async () => {
            // 1. Generamos un token REAL usando tu propia utilidad JWTAdapter
            // (El mismo payload que generas en tu UserServiceImpl.login)
            const payload = { id: 1, name: 'TestUser', role: 'ADMIN' };
            const validToken = await JWTAdapter.generateToken(payload, '2h');

            // 2. Hacemos la petición inyectando el token válido en las cabeceras
            const response = await request(app)
                .get('/category/')
                .set('Authorization', `Bearer ${validToken}`);

            // 3. ¡El middleware nos debe dejar pasar!
            expect(response.status).toBe(200);
            expect(response.body.result.length).toBeGreaterThan(0);
        });

    });
});