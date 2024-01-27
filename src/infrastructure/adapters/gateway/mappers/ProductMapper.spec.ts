import {Money} from '../../../../core/domain/valueObjects/Money';
import Product from 'src/core/domain/entities/Product';
import ProductMapper from './ProductMapper';
import {ProductEntity} from '../entity/ProductEntity';
import {ProductCategory} from "../../../../core/domain/enums/ProductCategory";

jest.mock('../../../../core/domain/valueObjects/Money');

describe('ProductMapper', () => {
    let price: Money;
    let mockProductEntity: ProductEntity;

    beforeEach(async () => {
        price = await Money.create(100);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('toDomain', () => {
        it('should map ProductEntity to Product domain object', async () => {
            const mockProductEntity: ProductEntity = {
                _id: '123',
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                category: ProductCategory.DESSERT,
                imageUrl: 'https://example.com/image.png',
                createdAt: new Date(),
            };

            Money.create = jest.fn().mockResolvedValue({value: mockProductEntity.price} as Money);

            const result = await ProductMapper.toDomain(mockProductEntity);

            expect(result).toEqual({
                id: '123',
                name: 'Test Product',
                description: 'Test Description',
                price: {value: 100},
                category: ProductCategory.DESSERT,
                imageUrl: 'https://example.com/image.png',
                createdAt: mockProductEntity.createdAt,
            });
        });
    });

    describe('toDomainList', () => {
        it('should map an array of ProductEntity to an array of Product domain objects', async () => {
            const mockProductEntities: ProductEntity[] = [
                {
                    _id: '123',
                    name: 'Test Product 1',
                    description: 'Test Description 1',
                    price: 100,
                    category: ProductCategory.DESSERT,
                    imageUrl: 'https://example.com/image1.png',
                    createdAt: new Date(),
                },
                {
                    _id: '456',
                    name: 'Test Product 2',
                    description: 'Test Description 2',
                    price: 150,
                    category: ProductCategory.GARNISH,
                    imageUrl: 'https://example.com/image2.png',
                    createdAt: new Date(),
                },
            ];

            const mockMoneyValue = jest.fn();

            Money.create = jest.fn().mockImplementation((value: number) => {
                mockMoneyValue(value);
                return Promise.resolve({value} as Money);
            });

            const result = await ProductMapper.toDomainList(mockProductEntities);

            expect(result).toEqual([
                {
                    id: '123',
                    name: 'Test Product 1',
                    description: 'Test Description 1',
                    price: {value: 100},
                    category: ProductCategory.DESSERT,
                    imageUrl: 'https://example.com/image1.png',
                    createdAt: mockProductEntities[0].createdAt,
                },
                {
                    id: '456',
                    name: 'Test Product 2',
                    description: 'Test Description 2',
                    price: {value: 150},
                    category: ProductCategory.GARNISH,
                    imageUrl: 'https://example.com/image2.png',
                    createdAt: mockProductEntities[1].createdAt,
                },
            ]);

            // Ensure that Money.create was called twice with the correct values
            expect(mockMoneyValue).toHaveBeenCalledWith(100);
            expect(mockMoneyValue).toHaveBeenCalledWith(150);
        });
    });

    describe('toEntity', () => {
        it('should map Product domain object to ProductEntity', () => {

            const mockProduct: Product = {
                id: '123',
                name: 'Test Product',
                description: 'Test Description',
                price: price,
                category: ProductCategory.DESSERT,
                imageUrl: 'https://example.com/image.png',
                createdAt: new Date(),
            };

            const result = ProductMapper.toEntity(mockProduct);

            expect(result).toEqual({
                _id: '123',
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                category: ProductCategory.DESSERT,
                imageUrl: 'https://example.com/image.png',
                createdAt: mockProduct.createdAt,
            });
        });

        it('should generate a new id if the Product has no id', () => {
            const mockProduct: Product = {
                id: null,
                name: 'Test Product',
                description: 'Test Description',
                price: price,
                category: ProductCategory.GARNISH,
                imageUrl: 'https://example.com/image.png',
                createdAt: new Date(),
            };

            const result = ProductMapper.toEntity(mockProduct);

            expect(result._id).toBeDefined();
            expect(typeof result._id).toBe('string');
        });
    });
});
