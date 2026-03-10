import { MovementServiceImpl } from '../src/services/MovementServiceImpl';
import { MovementRepository } from '../src/repositories/MovementRepository';
import { MovementDTO } from '../src/dtos/MovementDTO';
import { HttpErrors } from '../src/utils/HttpErrors';
// Asumiendo la ruta de tu entidad Movement
import { Movement } from '../src/Models/movement.entity';
import { } from 'jest';

describe('MovementServiceImpl', () => {

    let service: MovementServiceImpl;
    let mockRepo: jest.Mocked<MovementRepository>;

    // Datos de prueba
    let mockMovement: Movement;

    beforeEach(() => {
        // Mockeamos solo los métodos que el MovementService utiliza del repo
        mockRepo = {
            findAllByPage: jest.fn(),
            findOneById: jest.fn(),
            findByConditions: jest.fn(),
        } as any;

        service = new MovementServiceImpl(mockRepo);

        // Preparamos una entidad base simulada
        mockMovement = new Movement();
        mockMovement.id = 1;
        // mockMovement.type = 'IN'; (Agrega las propiedades necesarias de tu entidad)

        // Mockeamos la función estática fromEntity para controlar la conversión
        jest.spyOn(MovementDTO, 'fromEntity').mockImplementation((entity: any) => {
            return {
                id: entity.id,
                // Agrega otras propiedades del DTO si las necesitas en las aserciones
            } as unknown as MovementDTO;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPaginated', () => {
        it('should return paginated movements and count', async () => {
            mockRepo.findAllByPage.mockResolvedValue([[mockMovement], 1]);

            // Llamamos sin argumentos para que aplique el default `page = 1`
            const response = await service.getAllPaginated();

            // PPP es 20. page = 1 -> offset = 0, limit = 20
            expect(mockRepo.findAllByPage).toHaveBeenCalledWith(0, 20);
            expect(response.result.length).toBe(1);
            expect(response.result[0].id).toBe(1);
        });

        it('should return empty list if no movements exist (does not throw NotFound)', async () => {
            // A diferencia de los otros servicios, este no lanza NotFound si está vacío
            mockRepo.findAllByPage.mockResolvedValue([[], 0]);

            const response = await service.getAllPaginated(2);

            // page = 2 -> offset = 20, limit = 20
            expect(mockRepo.findAllByPage).toHaveBeenCalledWith(20, 20);
            expect(response.result.length).toBe(0);
        });
    });

    describe('getOne', () => {
        it('should return a movement when it exists', async () => {
            mockRepo.findOneById.mockResolvedValue(mockMovement);

            const response = await service.getOne(1);

            expect(mockRepo.findOneById).toHaveBeenCalledWith(1);
            expect(response.result?.id).toBe(1);
        });

        it('should throw NotFound when movement does not exist', async () => {
            mockRepo.findOneById.mockResolvedValue(null);

            await expect(service.getOne(1))
                .rejects
                .toThrow(HttpErrors.NotFound());
        });
    });

    describe('getByQueryParams', () => {
        const mockParams = {
            page: 1,
            type: 'IN',
            userId: 5
        };

        it('should return movements when conditions match', async () => {
            mockRepo.findByConditions.mockResolvedValue([[mockMovement], 1]);

            const response = await service.getByQueryParams(mockParams);

            expect(mockRepo.findByConditions).toHaveBeenCalledWith(mockParams, 0, 20);
            expect(response.result.length).toBe(1);
            expect(response.result[0].id).toBe(1);
        });

        it('should calculate offset correctly based on params.page', async () => {
            mockRepo.findByConditions.mockResolvedValue([[mockMovement], 1]);

            // Probamos pasando la página 3 en los parámetros
            const page3Params = { ...mockParams, page: 3 };
            await service.getByQueryParams(page3Params);

            // page = 3 -> offset = 40 (20 * 2), limit = 20
            expect(mockRepo.findByConditions).toHaveBeenCalledWith(page3Params, 40, 20);
        });

        it('should throw NotFound when no movements exist', async () => {
            mockRepo.findAllByPage.mockResolvedValue([[], 0]);

            await expect(service.getAllPaginated(2))
                .rejects
                .toThrow(HttpErrors.NotFound());

            expect(mockRepo.findAllByPage).toHaveBeenCalledWith(20, 20);
        });
    });
});