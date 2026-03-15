import request from 'supertest';
import { DataSource } from 'typeorm';
import { app } from '../src/app';
import { Category } from '../src/Models/category.entity';
import { Product } from '../src/Models/product.entity';
import { TestDataSource } from './test-datasource';

// ==========================================
// 1. MOCKS (Deben ir antes de las importaciones que los usan)
// ==========================================

// Mockeamos el middleware de autorización para que deje pasar todas las peticiones en los tests
jest.mock('../src/utils/AuthorizationMiddleware', () => ({
    RBACMiddleware: {
        requireAutentication: jest.fn(() => (req: any, res: any, next: any) => next())
    }
}));

// // Creamos una Base de Datos SQLite en memoria puramente para los tests
// const TestDataSource = new DataSource({
//     type: 'sqlite',
//     database: ':memory:',
//     entities: [Category, Product],
//     synchronize: true,
//     logging: true,
// });

// Mockeamos tu archivo de configuración de MySQL usando un **getter dinámico**
// Esto evita el ReferenceError por Temporal Dead Zone
jest.mock('../src/config/MySQL-datasource', () => {
    const { TestDataSource } = require('./test-datasource'); // <-- dinámico
    return { MySQLDataSource: TestDataSource };
});

// ==========================================
// 2. SUITE DE TESTS
// ==========================================

describe('Category Integration Tests', () => {

    // Inicializamos la BD de prueba antes de todos los tests
    beforeAll(async () => {
        await TestDataSource.initialize();
    });

    // Limpiamos datos después de cada test
    afterEach(async () => {
        const categoryRepo = TestDataSource.getRepository(Category);
        await categoryRepo.clear();
    });

    // Cerramos la conexión al finalizar todos los tests
    afterAll(async () => {
        await TestDataSource.destroy();
    });

    // --- EMPEZAMOS A PROBAR LAS RUTAS ---

    describe('POST /category/insert', () => {
        it('should create a new category and save it to the DB', async () => {
            const newCategoryData = {
                name: 'Electronics',
                description: 'Devices and gadgets'
            };

            const response = await request(app)
                .post('/category/insert')
                .send(newCategoryData);

            expect(response.status).toBe(200);
            expect(response.body.result).toHaveProperty('id');
            expect(response.body.result.name).toBe('Electronics');

            const categoryRepo = TestDataSource.getRepository(Category);
            const savedCategory = await categoryRepo.findOneBy({ name: 'Electronics' });

            expect(savedCategory).not.toBeNull();
            expect(savedCategory?.description).toBe('Devices and gadgets');
        });
    });

    describe('GET /category/', () => {
        it('should return a list of categories', async () => {
            const categoryRepo = TestDataSource.getRepository(Category);
            const cat = new Category();
            cat.name = 'Books';
            cat.description = 'Library items';
            await categoryRepo.save(cat);

            const response = await request(app).get('/category/');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.result)).toBe(true);
            expect(response.body.result.length).toBe(1);
            expect(response.body.result[0].name).toBe('Books');
        });
    });

    describe('GET /category/:id', () => {
        it('should return a single category by id', async () => {
            const categoryRepo = TestDataSource.getRepository(Category);
            const cat = await categoryRepo.save({
                name: 'Toys',
                description: 'For kids'
            });

            const response = await request(app).get(`/category/${cat.id}`);

            expect(response.status).toBe(200);
            expect(response.body.result.id).toBe(cat.id);
            expect(response.body.result.name).toBe('Toys');
        });

        it('should return 404 if category does not exist', async () => {
            const response = await request(app).get(`/category/9999`);
            expect(response.status).toBe(404);
        });
    });
});