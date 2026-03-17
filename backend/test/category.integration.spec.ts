import request from 'supertest';
import { app } from '../src/app';
import { TestDataSource } from './test-datasource';
import { Category } from '../src/Models/category.entity';
import { clearAllTables, setupTestDB, teardownTestDB } from './setup-db';

// Mock middleware de autorización
jest.mock('../src/utils/AuthorizationMiddleware', () => ({
    RBACMiddleware: {
        requireAutentication: jest.fn(() => (req: any, res: any, next: any) => next())
    }
}));

// Mock MySQL datasource para que las rutas usen TestDataSource
jest.mock('../src/config/MySQL-datasource', () => {
    const { TestDataSource } = require('./test-datasource'); // require dinámico
    return { MySQLDataSource: TestDataSource };
});

describe('Category Integration Tests', () => {
    // --- Conexión a DB de test ---
    beforeAll(async () => {
        await setupTestDB();
        await clearAllTables(); // ← mismo fix
    });

    afterAll(async () => {
        await teardownTestDB();
    });
    // --- Limpiar datos entre tests usando transacciones ---
    let queryRunner: any;

    beforeEach(async () => {
        queryRunner = TestDataSource.createQueryRunner();
        await queryRunner?.connect();
        await queryRunner?.startTransaction();
    });

    // afterEach(async () => {
    //     await queryRunner?.rollbackTransaction();
    //     await queryRunner?.release();
    // });

    afterAll(async () => {
        await teardownTestDB(); // cierra la conexión de este archivo
    });

    // --- TESTS ---
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

            // Accedemos al objeto real
            const category = response.body.category.result;

            expect(category).toBeDefined();
            expect(category).toHaveProperty('id');
            expect(category.name).toBe('Electronics');

            // Verificamos en la DB real
            const categoryRepo = TestDataSource.getRepository(Category);
            const savedCategory = await categoryRepo.findOneBy({ name: 'Electronics' });

            expect(savedCategory).not.toBeNull();
            expect(savedCategory?.description).toBe('Devices and gadgets');
        });
    });

    describe('GET /category/:id', () => {
        it('should return a single category by id', async () => {
            const categoryRepo = TestDataSource.getRepository(Category);
            const cat = await categoryRepo.save({ name: 'Toys', description: 'For kids' });

            const response = await request(app).get(`/category/${cat.id}`);
            expect(response.status).toBe(200);
            expect(response.body.result.id).toBe(cat.id);
        });

        it('should return 404 if category does not exist', async () => {
            const response = await request(app).get(`/category/9999`);
            expect(response.status).toBe(404);
        });
    });
});