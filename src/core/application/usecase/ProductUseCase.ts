import Product from '../../domain/entities/Product';
import { IProductGateway } from '../repositories/IProductGateway';
import { HttpNotFoundException } from '../../../infrastructure/exceptions/HttpNotFoundException';

export default class ProductUseCase {
  public static async getProductById(
    id: string,
    productGateway: IProductGateway,
  ): Promise<Product> {
    const product = await productGateway.getById(id);
    if (!product)
      throw new HttpNotFoundException(`Product with id ${id} not found`);
    return product;
  }

  public static async getAllProducts(
    params: any,
    productGateway: IProductGateway,
  ) {
    return await productGateway.getAll(params);
  }

  public static async createProduct(
    product: Product,
    productGateway: IProductGateway,
  ) {
    await product.price.validate();

    return await productGateway.create(product);
  }

  public static async updateProduct(
    id: string,
    product: Product,
    productGateway: IProductGateway,
  ) {
    await product.price.validate();
    //validate product existence
    await this.getProductById(id, productGateway);
    await productGateway.update(id, product);
    return product;
  }
  public static async deleteProduct(
    id: string,
    productGateway: IProductGateway,
  ) {
    await this.getProductById(id, productGateway);
    return await productGateway.delete(id);
  }
}
