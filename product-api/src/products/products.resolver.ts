import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product, ProductsResponse, MessageResponse } from './entities/product.entity';
import {
  CreateProductInput,
  UpdateProductInput,
  QueryProductInput,
} from './inputs/product.input';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    const dto = {
      ...createProductInput,
      description: createProductInput.description || '',
    };
    return this.productsService.create(dto);
  }

  @Query(() => ProductsResponse, { name: 'products' })
  async findAll(
    @Args('query', { nullable: true }) query?: QueryProductInput,
  ): Promise<ProductsResponse> {
    const queryDto = query || { page: 1, limit: 10 };
    return this.productsService.findAll(queryDto);
  }

  @Query(() => Product, { name: 'product' })
  async findOne(@Args('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id') id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductInput);
  }

  @Mutation(() => MessageResponse)
  async removeProduct(@Args('id') id: string): Promise<MessageResponse> {
    await this.productsService.remove(id);
    return { message: 'Product deleted successfully' };
  }

  @Query(() => String)
  async helloProduct(): Promise<string> {
    return 'Hello from Products GraphQL API!';
  }
}
