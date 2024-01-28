import {ProductController} from './ProductController';
import {IConnection} from '../adapters/external/IConnection';
import ProductDTO from '../../core/application/dto/ProductDTO';
import Product from '../../core/domain/entities/Product';
import {Money} from '../../core/domain/valueObjects/Money';
import {ProductCategory} from "../../core/domain/enums/ProductCategory";
import ProductUseCase from "../../core/application/usecase/ProductUseCase";

describe('ProductController', () => {
    let dbConnection: IConnection;
    let mockProduct1: Product;
    let mockProduct2: Product;
    let mockProductDTO1: ProductDTO;
    let mockProductDTO2: ProductDTO;

    beforeEach(async () => {
        dbConnection = {
            connect: jest.fn(),
            getCollection: jest.fn()
        };
        const fixedDate = new Date();
        mockProduct1 = {
            id: '1',
            name: 'Test Product',
            description: 'Test Description',
            price: await Money.create(100),
            category: ProductCategory.GARNISH,
            imageUrl: 'Test Image URL',
            createdAt: fixedDate
        };
        mockProduct2 = {
            id: '2',
            name: 'Test Product 2',
            description: 'Test Description 2',
            price: await Money.create(200),
            category: ProductCategory.DESSERT,
            imageUrl: 'Test Image URL',
            createdAt: fixedDate
        };
        mockProductDTO1 = {
            id: '1',
            name: 'Test Product',
            description: 'Test Description',
            price: 100,
            category: ProductCategory.GARNISH,
            imageUrl: 'Test Image URL',
            createdAt: fixedDate
        };
        mockProductDTO2 = {
            id: '2',
            name: 'Test Product 2',
            description: 'Test Description 2',
            price: 200,
            category: ProductCategory.DESSERT,
            imageUrl: 'Test Image URL',
            createdAt: fixedDate
        };
    });

    it('Should be defined', () => {
        expect(ProductUseCase).toBeDefined();
    });

    describe('getAllProducts', () => {
        it('should return all products', async () => {
            const mockProducts: Product[] = [mockProduct1, mockProduct2];
            jest.spyOn(ProductUseCase, 'getAllProducts').mockResolvedValue(mockProducts);

            const result = await ProductController.getAllProducts({}, dbConnection);
            expect(result).toEqual([mockProductDTO1, mockProductDTO2]);
        });
    });

    describe('getProductById', () => {
        it('should return a product by id', async () => {
            jest.spyOn(ProductUseCase, 'getProductById').mockResolvedValue(mockProduct1);

            const result = await ProductController.getProductById('1', dbConnection);
            expect(result).toEqual(mockProductDTO1);
        });
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            jest.spyOn(ProductUseCase, 'createProduct').mockResolvedValue(mockProduct1);

            const result = await ProductController.createProduct(mockProductDTO1, dbConnection);
            expect(result).toEqual(mockProductDTO1);
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            jest.spyOn(ProductUseCase, 'updateProduct').mockResolvedValue(mockProduct1);

            const result = await ProductController.updateProduct('1', mockProductDTO1, dbConnection);
            expect(result).toEqual(mockProductDTO1);
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            jest.spyOn(ProductUseCase, 'deleteProduct').mockResolvedValue(undefined);

            await ProductController.deleteProduct('1', dbConnection);
        });
    });
});
