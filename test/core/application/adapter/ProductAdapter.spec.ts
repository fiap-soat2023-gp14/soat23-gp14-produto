import { ProductAdapter } from '../../../src/core/application/adapter/ProductAdapter';
import ProductDTO from '../../../src/core/application/dto/ProductDTO';
import Product from '../../../src/core/domain/entities/Product';
import { Money } from '../../../src/core/domain/valueObjects/Money';

describe('ProductAdapter', () => {
  const mockProductDTO: ProductDTO = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    category: 'Test Category',
    imageUrl: 'Test Image URL',
    createdAt: new Date(),
  };

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: { value: 100 },
    category: 'Test Category',
    imageUrl: 'Test Image URL',
    createdAt: new Date(),
  };

  describe('toDomain', () => {
    it('should convert DTO to domain model successfully', async () => {
      jest.spyOn(Money, 'create').mockResolvedValue({ value: 100 });

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
