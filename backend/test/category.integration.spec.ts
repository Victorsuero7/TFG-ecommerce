import request from 'supertest';
import { DataSource } from 'typeorm';
import { app } from '../src/app';
// Importamos tus entidades para la base de datos de prueba
import { Category } from '../src/Models/category.entity';
import { Product } from '../src/Models/product.entity';

// ==========================================
// 1. MOCKS (Deben ir antes de las importaciones que los usan)
// ==========================================

// Mockeamos el middleware de autorización para que deje pasar todas las peticiones en los tests
jest.mock('../src/utils/AuthorizationMiddleware', () => ({
    RBACMiddleware: {
        requireAutentication: jest.fn(() => (req: any, res: any, next: any) => next())
    }
}));

// Creamos una Base de Datos SQLite en memoria puramente para los tests
// Es rapidísima, se destruye al acabar, y no toca tu MySQL real.
const TestDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:', // Base de datos efímera en RAM
    entities: [Category, Product], // Añadimos las entidades relacionadas
    synchronize: true, // Crea las tablas automáticamente
    logging: false,
});

// Mockeamos tu archivo de configuración de MySQL para que tu CategoryRoutes 
// recoja esta base de datos de prueba en lugar de la original.
jest.mock('../src/config/MySQL-datasource', () => ({
    MySQLDataSource: TestDataSource
}));

// ==========================================
// 2. SUITE DE TESTS
// ==========================================

describe('Category Integration Tests', () => {

    // Antes de todos los tests: Inicializamos la BD de prueba en memoria
    beforeAll(async () => {
        await TestDataSource.initialize();
    });

    // Después de cada test: Limpiamos la tabla para que un test no afecte a otro
    afterEach(async () => {
        const categoryRepo = TestDataSource.getRepository(Category);
        await categoryRepo.clear();
    });

    // Después de todos los tests: Cerramos la conexión
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

            // Hacemos una petición HTTP REAL a tu app
            const response = await request(app)
                .post('/category/insert')
                .send(newCategoryData);

            // Validamos que el servidor responde correctamente
            expect(response.status).toBe(200); // O 201 si así lo tienes configurado
            expect(response.body.result).toHaveProperty('id');
            expect(response.body.result.name).toBe('Electronics');

            // Validamos que DE VERDAD se guardó en la base de datos
            const categoryRepo = TestDataSource.getRepository(Category);
            const savedCategory = await categoryRepo.findOneBy({ name: 'Electronics' });

            expect(savedCategory).not.toBeNull();
            expect(savedCategory?.description).toBe('Devices and gadgets');
        });
    });

    describe('GET /category/', () => {
        it('should return a list of categories', async () => {
            // 1. Preparamos el terreno insertando un dato directamente en la BD de prueba
            const categoryRepo = TestDataSource.getRepository(Category);
            const cat = new Category();
            cat.name = 'Books';
            cat.description = 'Library items';
            await categoryRepo.save(cat);

            // 2. Hacemos la petición a tu endpoint
            const response = await request(app).get('/category/');

            // 3. Comprobamos la respuesta
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

        it('should return 404 (or error code) if category does not exist', async () => {
            // Suponiendo que tu HttpErrors.NotFound() devuelve un 404
            const response = await request(app).get(`/category/9999`);

            // Ajusta este expect al código de estado real que devuelva tu manejador de errores
            expect(response.status).toBe(404);
        });
    });
});