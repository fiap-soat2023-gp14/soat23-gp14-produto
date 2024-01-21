import { IProductGateway } from '../repositories/IProductGateway';
import ProductUseCase from './ProductUseCase';
import Product from '../../domain/entities/Product';
import { HttpNotFoundException } from '../../../infrastructure/exceptions/HttpNotFoundException';
import {ProductCategory} from "../../domain/enums/ProductCategory";
import {Money} from "../../domain/valueObjects/Money";
import {Test, TestingModule} from "@nestjs/testing";
import ProductGateway from "../../../infrastructure/adapters/gateway/ProductGateway";

describe('ProductUseCase', () => {
    let productUseCase: ProductUseCase;
    let productGateway: IProductGateway;
    let mockProduct: Product;

    beforeEach(async () => {
        const price = await Money.create(100);
        const fixedDate = new Date('2022-01-01T00:00:00Z');
        mockProduct = {
            id: '1',
            name: 'Test Product',
            description: 'Test Description',
            price: price,
            category: ProductCategory.GARNISH,
            imageUrl: 'http://image.png',
            createdAt: fixedDate,
        };

        productGateway = {
            getById: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductUseCase,
                { provide: 'IUserGateway', useValue: productGateway }
            ],
        }).compile();
        productUseCase = module.get<ProductUseCase>(ProductUseCase);
    });

    it('Should be defined', () => {
        expect(ProductUseCase).toBeDefined();
    });

    describe('getProductById', () => {
        it('Should return a product if it exists', async () => {
            productGateway.getById = jest.fn().mockResolvedValue(mockProduct);

            const result = await ProductUseCase.getProductById('1', productGateway);
            expect(result).toEqual(mockProduct);
        });

        it('Should throw an error if the product does not exist', async () => {
            productGateway.getById = jest.fn().mockResolvedValue(null);

            await expect(ProductUseCase.getProductById('1', productGateway)).rejects.toThrow(HttpNotFoundException);
        });
    });

    describe('getAllProducts', () => {
        it('Should return all products', async () => {
            const mockProducts = [mockProduct, mockProduct];
            productGateway.getAll = jest.fn().mockResolvedValue(mockProducts);

            const result = await ProductUseCase.getAllProducts({}, productGateway);
            expect(result).toEqual(mockProducts);
        });
    });

    describe('createProduct', () => {
        it('Should create a product successfully', async () => {
            productGateway.create = jest.fn().mockResolvedValue(mockProduct);
            mockProduct.price.validate = jest.fn().mockResolvedValue(true);

            const result = await ProductUseCase.createProduct(mockProduct, productGateway);
            expect(result).toEqual(mockProduct);
        });

        it('Should throw an error if price validation fails', async () => {
            mockProduct.price.validate = jest.fn().mockRejectedValue(new Error('Invalid price'));

            await expect(ProductUseCase.createProduct(mockProduct, productGateway)).rejects.toThrow('Invalid price');
        });
    });

    describe('updateProduct', () => {
        it('Should update a product successfully', async () => {
            productGateway.getById = jest.fn().mockResolvedValue(mockProduct);
            const mockUpdatedProduct = {
                id: '1',
                name: 'Test Product',
                description: 'Test Description',
                price: await Money.create(200),
                category: ProductCategory.GARNISH,
                imageUrl: 'http://image.png',
                createdAt: new Date('2022-01-01T00:00:00Z'),
            };
            productGateway.update = jest.fn().mockResolvedValue(mockUpdatedProduct);
            mockProduct.price.validate = jest.fn().mockResolvedValue(true);

            const result = await ProductUseCase.updateProduct('1', mockUpdatedProduct, productGateway);
            expect(result).toEqual(mockUpdatedProduct);
        });

        it('Should throw an error if the product does not exist', async () => {
            productGateway.getById = jest.fn().mockResolvedValue(null);

            await expect(ProductUseCase.updateProduct('1', mockProduct, productGateway)).rejects.toThrow(HttpNotFoundException);
        });

        it('Should throw an error if price validation fails', async () => {
            productGateway.getById = jest.fn().mockResolvedValue(mockProduct);
            mockProduct.price.validate = jest.fn().mockRejectedValue(new Error('Invalid price'));

            await expect(ProductUseCase.updateProduct('1', mockProduct, productGateway)).rejects.toThrow('Invalid price');
        });
    });

    describe('deleteProduct', () => {
        it('Should delete a product successfully', async () => {
            productGateway.getById = jest.fn().mockResolvedValue(mockProduct);
            productGateway.delete = jest.fn().mockResolvedValue(true);

            const result = await ProductUseCase.deleteProduct('1', productGateway);
            expect(result).toBeTruthy();
        });

        it('Should throw an error if the product does not exist', async () => {
            productGateway.getById = jest.fn().mockResolvedValue(null);

            await expect(ProductUseCase.deleteProduct('1', productGateway)).rejects.toThrow(HttpNotFoundException);
        });
    });
});