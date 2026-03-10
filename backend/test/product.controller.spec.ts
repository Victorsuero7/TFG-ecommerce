import { Request, Response } from 'express';
import { ProductController } from '../src/controllers/ProductController';
import { ProductService } from '../src/services/ProductService';
import { HttpErrors } from '../src/utils/HttpErrors';
import { SchemaResponse } from '../src/config/SchemaResponse';

describe('ProductController', () => {

    let controller: ProductController;
    let mockService: jest.Mocked<ProductService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {

        mockService = {
            insert: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
            getById: jest.fn(),
            getAll: jest.fn(),
            getAllPaginated: jest.fn(),
            filterByStock: jest.fn(),
            getByName: jest.fn(),
            getByDescription: jest.fn(),
            getByCategoryName: jest.fn(),
            delete: jest.fn(),
            listDisabled: jest.fn(),
            findByCategory: jest.fn()
        } as any;

        controller = new ProductController(mockService);

        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getOne', () => {

        it('should return 200 and product when found', async () => {

            req.params = { id: '1' };

            const mockResponse = new SchemaResponse({ id: 1 });
            mockService.getById.mockResolvedValue(mockResponse as any);

            await controller.getOne(req as Request, res as Response);

            expect(mockService.getById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it('should return 400 when id is missing', async () => {

            req.params = {};

            await controller.getOne(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return error status when service throws HttpError', async () => {

            req.params = { id: '1' };
            mockService.getById.mockRejectedValue(HttpErrors.NotFound());

            await controller.getOne(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
        });

    });

    describe('getAll', () => {

        it('should return all products', async () => {

            const mockResponse = new SchemaResponse([]);
            mockService.getAll.mockResolvedValue(mockResponse as any);

            await controller.getAll(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

    });

});