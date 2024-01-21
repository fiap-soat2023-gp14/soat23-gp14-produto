import ProductDTO from "../dto/ProductDTO";
import Product from "../../domain/entities/Product";
import {Money} from "../../domain/valueObjects/Money";
import ProductAdapter from "./ProductAdapter";
import {ProductCategory} from "../../domain/enums/ProductCategory";

describe('ProductAdapter', () => {
  let mockProduct: Product;
  let mockProductDTO: ProductDTO;

  beforeEach(async () => {
    const price = await Money.create(100);
    const fixedDate = new Date('2022-01-01T00:00:00Z');
    mockProduct = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: price,
      category: ProductCategory.GARNISH,
      imageUrl: 'https://image.png',
      createdAt: fixedDate,
    };

    mockProductDTO = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      category: ProductCategory.GARNISH,
      imageUrl: 'https://image.png',
      createdAt: fixedDate,
    };
  });


  describe('toDomain', () => {
    it('Should convert ProductDTO to Product domain model successfully', async () => {
      let mockedMoney = Money.create(100);
      jest.spyOn(Money, 'create').mockResolvedValue(mockedMoney);

      const result = await ProductAdapter.toDomain(mockProductDTO);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('toDTOList', () => {
    it('Should convert a list of Product domain models to ProductDTOs successfully', () => {
      jest.spyOn(ProductAdapter, 'toDTO').mockReturnValue(mockProductDTO);

      const result = ProductAdapter.toDTOList([mockProduct]);
      expect(result).toEqual([mockProductDTO]);
    });
  });

  describe('toDTO', () => {
    it('Should convert Product domain model to ProductDTO successfully', () => {
      const result = ProductAdapter.toDTO(mockProduct);
      expect(result).toEqual(mockProductDTO);
    });
  });

  describe('toDTOEmptyList', () => {
    it('Should convert a list of Product domain models to ProductDTOs successfully', () => {

      const result = ProductAdapter.toDTOList([]);
      expect(result).toEqual([]);
    });
  });
});