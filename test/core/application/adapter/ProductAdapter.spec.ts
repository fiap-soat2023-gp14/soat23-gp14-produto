import ProductDTO from "../../../../src/core/application/dto/ProductDTO";
import Product from "../../../../src/core/domain/entities/Product";
import {Money} from "../../../../src/core/domain/valueObjects/Money";
import ProductAdapter from "../../../../src/core/application/adapter/ProductAdapter";
import {ProductCategory} from "../../../../src/core/domain/enums/ProductCategory";

describe('ProductAdapter', () => {
  let mockProduct: Product;
  let mockProductDTO: ProductDTO;

  beforeEach(async () => {
    const price = await Money.create(100);
    const currentDate = new Date();
    mockProduct = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: price,
      category: ProductCategory.GARNISH,
      imageUrl: 'http://image.png',
      createdAt: currentDate,
    };

    mockProductDTO = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      category: ProductCategory.GARNISH,
      imageUrl: 'http://image.png',
      createdAt: currentDate,
    };
  });


  describe('toDomain', () => {
    it('should convert DTO to domain model successfully', async () => {
      let mockedMoney = Money.create(100);
      jest.spyOn(Money, 'create').mockResolvedValue(mockedMoney);

      const result = await ProductAdapter.toDomain(mockProductDTO);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('toDTOList', () => {
    it('should convert a list of domain models to DTOs successfully', () => {
      jest.spyOn(ProductAdapter, 'toDTO').mockReturnValue(mockProductDTO);

      const result = ProductAdapter.toDTOList([mockProduct]);
      expect(result).toEqual([mockProductDTO]);
    });
  });

  describe('toDTO', () => {
    it('should convert domain model to DTO successfully', () => {
      const result = ProductAdapter.toDTO(mockProduct);
      expect(result).toEqual(mockProductDTO);
    });
  });
});