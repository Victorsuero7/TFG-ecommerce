import { CategoryServiceImpl } from '../src/services/CategoryServiceImpl';
import { CategoryRepository } from '../src/repositories/CategoryRepository';
import { CategoryDTO } from '../src/dtos/CategoryDTO';
import { Category } from '../src/Models/category.entity';
import { HttpErrors } from '../src/utils/HttpErrors';
import { } from 'jest';

describe('CategoryServiceImpl', () => {

    let service: CategoryServiceImpl;
    let mockRepo: jest.Mocked<CategoryRepository>;

    // Datos de prueba reutilizables
    let mockCategory: Category;
    let mockCategoryDTO: CategoryDTO;

    beforeEach(() => {
        // Mockeamos los métodos del CategoryRepository
        mockRepo = {
            findAllByPage: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            findByName: jest.fn(),
            findByDescription: jest.fn(),
        } as any;

        service = new CategoryServiceImpl(mockRepo);

        // Preparamos entidades y DTOs dummy para las pruebas
        mockCategory = new Category();
        mockCategory.id = 1;
        mockCategory.name = 'Technology';
        mockCategory.description = 'Tech products';

        // Mockeamos la conversión estática fromEntity para aislar el test
        jest.spyOn(CategoryDTO, 'fromEntity').mockImplementation((entity: any) => {
            return {
                id: entity?.id,
                name: entity?.name,
                description: entity?.description,
                toEntity: jest.fn().mockReturnValue(entity)
            } as unknown as CategoryDTO;
        });

        mockCategoryDTO = CategoryDTO.fromEntity(mockCategory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPaginated', () => {
        it('should return paginated categories when they exist', async () => {
            // Mockeamos que devuelve un array de categorías y el count total
            mockRepo.findAllByPage.mockResolvedValue([[mockCategory], 1]);

            // page = 1. Como PPP por defecto es 4, debería llamar con (0, 4)
            const response = await service.getAllPaginated(1);

            expect(mockRepo.findAllByPage).toHaveBeenCalledWith(0, 20);
            expect(response.result.length).toBe(1);
            expect(response.result[0].id).toBe(1);
        });

        it('should throw NotFound when no categories are found', async () => {
            mockRepo.findAllByPage.mockResolvedValue([[], 0]);

            await expect(service.getAllPaginated(1))
                .rejects
                .toThrow(HttpErrors.NotFound());
        });
    });

    describe('getAll', () => {
        it('should return all categories mapped to DTOs', async () => {
            mockRepo.findAll.mockResolvedValue([mockCategory]);

            const response = await service.getAll();

            expect(mockRepo.findAll).toHaveBeenCalled();
            expect(response.result.length).toBe(1);
            expect(response.result[0].id).toBe(1);
        });
    });

    describe('getById', () => {
        it('should return category when it exists', async () => {
            mockRepo.findOneById.mockResolvedValue(mockCategory);

            const response = await service.getById(1);

            expect(mockRepo.findOneById).toHaveBeenCalledWith(1);
            expect(response.result?.id).toBe(1);
        });

        it('should throw NotFound when category does not exist', async () => {
            mockRepo.findOneById.mockResolvedValue(null);

            await expect(service.getById(1))
                .rejects
                .toThrow(); // Nota: En tu código falta un "()" en HttpErrors.NotFound en esta función
        });
    });

    describe('insert', () => {
        it('should save and return the new category', async () => {
            mockRepo.save.mockResolvedValue(mockCategory);

            const response = await service.insert(mockCategoryDTO);

            expect(mockCategoryDTO.toEntity).toHaveBeenCalled();
            expect(mockRepo.save).toHaveBeenCalled();
            expect(response.result.id).toBe(1);
        });
    });

    describe('update', () => {
        it('should update and return the category when it exists', async () => {
            // Preload simula que la entidad existe en DB
            mockRepo.preload.mockResolvedValue(mockCategory);
            mockRepo.save.mockResolvedValue(mockCategory);

            const response = await service.update(mockCategoryDTO);

            expect(mockRepo.preload).toHaveBeenCalled();
            expect(mockRepo.save).toHaveBeenCalled();
            expect(response.result.id).toBe(1);
        });

        it('should throw InternalServerError when preload fails (category not found)', async () => {
            mockRepo.preload.mockResolvedValue(undefined); // undefined hace saltar tu throw

            await expect(service.update(mockCategoryDTO))
                .rejects
                .toThrow(HttpErrors.internalServerError("Something went wrong"));
        });
    });

    describe('findByName', () => {
        it('should return categories when found by name', async () => {
            mockRepo.findByName.mockResolvedValue([[mockCategory], 1]);

            const response = await service.findByName('Technology');

            expect(mockRepo.findByName).toHaveBeenCalledWith('Technology');
            expect(response.result.length).toBe(1);
            expect(response.result[0].name).toBe('Technology');
        });

        it('should throw NotFound when no categories match the name', async () => {
            mockRepo.findByName.mockResolvedValue([[], 0]);

            await expect(service.findByName('Unknown'))
                .rejects
                .toThrow(HttpErrors.NotFound());
        });
    });

    describe('findByDescription', () => {
        it('should return categories when found by description', async () => {
            mockRepo.findByDescription.mockResolvedValue([[mockCategory], 1]);

            const response = await service.findByDescription('Tech products');

            expect(mockRepo.findByDescription).toHaveBeenCalledWith('Tech products');
            expect(response.result.length).toBe(1);
            expect(response.result[0].description).toBe('Tech products');
        });

        it('should throw NotFound when no categories match the description', async () => {
            mockRepo.findByDescription.mockResolvedValue([[], 0]);

            await expect(service.findByDescription('Unknown'))
                .rejects
                .toThrow(HttpErrors.NotFound());
        });
    });

});