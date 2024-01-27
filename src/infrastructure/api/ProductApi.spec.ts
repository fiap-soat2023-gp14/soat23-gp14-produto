import {Test, TestingModule} from '@nestjs/testing';
import {IConnection} from '../adapters/external/IConnection';
import {ProductController} from '../controller/ProductController';
import ProductDTO from '../../core/application/dto/ProductDTO';
import {ProductCategory} from 'src/core/domain/enums/ProductCategory';
import ProductApi from "./ProductApi";

describe('ProductApi', () => {
    let productApi: ProductApi;
    let dbConnection: IConnection;
    let mockResponse: { json: any; status?: jest.Mock<any, any, any>; };

    beforeEach(async () => {
        dbConnection = {
            connect: jest.fn(),
            getCollection: jest.fn()
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductApi],
            providers: [
                {
                    provide: IConnection,
                    useValue: dbConnection,
                },
            ],
        }).compile();

        productApi = module.get<ProductApi>(ProductApi);
    });

    it('should be defined', () => {
        expect(productApi).toBeDefined();
    });

    describe('getAllProducts', () => {
        it('should return all products', async () => {
            const mockProducts: ProductDTO[] = [
                {
                    id: '1',
                    name: 'Test Product',
                    description: 'Test Description',
                    price: 100,
                    category: ProductCategory.GARNISH,
                    imageUrl: 'https://image.png',
                    createdAt: new Date(),
                },
                {
                    id: '2',
                    name: 'Test Product 2',
                    description: 'Test Description 2',
                    price: 200,
                    category: ProductCategory.DESSERT,
                    imageUrl: 'https://image.png',
                    createdAt: new Date(),
                },
            ]; // Initialize your mock products here
            jest.spyOn(ProductController, 'getAllProducts').mockResolvedValue(mockProducts);
            mockResponse.json = jest.fn().mockResolvedValue(mockProducts);

            expect(await productApi.getAllProducts(mockResponse, ProductCategory.GARNISH)).toEqual(mockProducts);
        });
    });

    describe('getProduct', () => {
        it('should return a product by id', async () => {
            const mockProduct: ProductDTO = {
                id: '1',
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                category: ProductCategory.GARNISH,
                imageUrl: 'https://image.png',
                createdAt: new Date(),
            };
            jest.spyOn(ProductController, 'getProductById').mockResolvedValue(mockProduct);
            mockResponse.json = jest.fn().mockResolvedValue(mockProduct);

            expect(await productApi.getProduct(mockResponse, '1')).toEqual(mockProduct);
        });
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            const mockProduct: ProductDTO = {
                id: '1',
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                category: ProductCategory.GARNISH,
                imageUrl: 'https://image.png',
                createdAt: new Date(),
            };
            jest.spyOn(ProductController, 'createProduct').mockResolvedValue(mockProduct);
            mockResponse.json = jest.fn().mockResolvedValue(mockProduct);

            expect(await productApi.createProduct(mockResponse, mockProduct)).toEqual(mockProduct);
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            jest.spyOn(ProductController, 'updateProduct').mockResolvedValue(undefined);
            mockResponse.json = jest.fn().mockResolvedValue(undefined);

            expect(await productApi.updateProduct(mockResponse, '1', {} as ProductDTO)).toBeUndefined();
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            jest.spyOn(ProductController, 'deleteProduct').mockResolvedValue(undefined);
            mockResponse.json = jest.fn().mockResolvedValue(undefined);

            expect(await productApi.deleteProduct(mockResponse, '1')).toBeUndefined();
        });
    });
});