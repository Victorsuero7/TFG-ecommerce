import { ProductServiceImpl } from '../src/services/ProductServiceImpl';
import { ProductRepository } from '../src/repositories/ProductRepository';
import { ProductDTO } from '../src/dtos/ProductDTO';
import { Product } from '../src/Models/product.entity';
import { HttpErrors } from '../src/utils/HttpErrors';
import { } from 'jest'

describe('ProductServiceImpl', () => {

    let service: ProductServiceImpl;
    let mockRepo: jest.Mocked<ProductRepository>;

    beforeEach(() => {

        mockRepo = {
            findAll: jest.fn(),
            findAllByPage: jest.fn(),
            findOneById: jest.fn(),
            save: jest.fn(),
            transaction: jest.fn(),
            findByName: jest.fn(),
            totalResultsByName: jest.fn(),
            stockBetween: jest.fn(),
            getDisabled: jest.fn(),
            findByCategory: jest.fn()
        } as any;

        service = new ProductServiceImpl(mockRepo);
    });

    describe('getById', () => {

        it('should return product when exists', async () => {

            const product = new Product();
            product.id = 1;

            mockRepo.findOneById.mockResolvedValue(product);

            const result = await service.getById(1);

            expect(mockRepo.findOneById).toHaveBeenCalledWith(1);
            expect(result.result?.id).toBe(1);
        });

        it('should throw NotFound when product does not exist', async () => {

            mockRepo.findOneById.mockResolvedValue(null);

            await expect(service.getById(1))
                .rejects
                .toThrow(HttpErrors.NotFound());
        });

    });

    describe('getAll', () => {

        it('should return mapped DTOs', async () => {

            const product = new Product();
            product.id = 1;

            mockRepo.findAll.mockResolvedValue([product]);

            const result = await service.getAll();

            expect(result.result.length).toBe(1);
            expect(result.result[0].id).toBe(1);
        });

    });

    describe('delete', () => {

        it('should disable product', async () => {

            const product = new Product();
            product.id = 1;
            product.enable = true;

            mockRepo.findOneById.mockResolvedValue(product);
            mockRepo.save.mockResolvedValue(product);

            const result = await service.delete(1);

            expect(product.enable).toBe(false);
            expect(mockRepo.save).toHaveBeenCalled();
            expect(result.result.id).toBe(1);
        });

        it('should throw NotFound if product does not exist', async () => {

            mockRepo.findOneById.mockResolvedValue(null);

            await expect(service.delete(1))
                .rejects
                .toThrow(HttpErrors.NotFound());
        });

    });

});
