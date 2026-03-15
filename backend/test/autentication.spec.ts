import request from 'supertest';
import { app } from '../src/app';
import { Category } from '../src/Models/category.entity';
import { TestDataSource } from './test-datasource';
import { JWTAdapter } from '../src/utils/Jwt';

// Mock dinámico de MySQLDataSource
jest.mock('../src/config/MySQL-datasource', () => {
    const { TestDataSource } = require('./test-datasource');
    return { MySQLDataSource: TestDataSource };
});

describe('Authentication Integration Tests (Category Routes)', () => {

    // -------------------------------
    // Inicialización de la base de datos
    // -------------------------------
    beforeAll(async () => {
        if (!TestDataSource.isInitialized) {
            await TestDataSource.initialize();
        }

        // Limpiamos tabla Category y User para tests limpios
        await TestDataSource.getRepository(Category).clear();
        await TestDataSource.getRepository('user').clear(); // o User entity si la tienes

        // Insertamos categoría de prueba
        await TestDataSource.getRepository(Category).save({ name: 'Security', description: 'Test' });
    });

    afterAll(async () => {
        if (TestDataSource.isInitialized) {
            await TestDataSource.destroy();
        }
    });

    describe('Security checks', () => {

        it('should return 401/403 (Unauthorized) if NO TOKEN is provided', async () => {
            const response = await request(app).get('/category/');
            expect([401, 403]).toContain(response.status);
        });

        it('should return 401/403 if an INVALID TOKEN is provided', async () => {
            const response = await request(app)
                .get('/category/')
                .set('Authorization', 'Bearer token-falso-12345');
            expect([401, 403]).toContain(response.status);
        });

        it('should return 200 OK if a VALID TOKEN is provided', async () => {
            const payload = { id: 1, name: 'TestUser', role: 'ADMIN' };
            const validToken = await JWTAdapter.generateToken(payload, '2h');

            const response = await request(app)
                .get('/category/')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            const categories = response.body.result || response.body.category;
            expect(Array.isArray(categories)).toBe(true);
            expect(categories.length).toBeGreaterThan(0);
        });

    });

});