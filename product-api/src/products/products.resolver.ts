import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../auth/decorators/current-user.decorator';
import { ProductsService } from './products.service';
import {
  Product,
  ProductsResponse,
  MessageResponse,
} from './entities/product.entity';
import { User } from '../auth/entities/user.stub';
import {
  CreateProductInput,
  UpdateProductInput,
  QueryProductInput,
} from './inputs/product.input';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() user: CurrentUserData,
  ): Promise<Product> {
    const dto = {
      ...createProductInput,
      description: createProductInput.description || '',
      userId: user.userId,
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
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Args('id') id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductInput);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(JwtAuthGuard)
  async removeProduct(@Args('id') id: string): Promise<MessageResponse> {
    await this.productsService.remove(id);
    return { message: 'Product deleted successfully' };
  }

  @Query(() => String)
  async helloProduct(): Promise<string> {
    return 'Hello from Products GraphQL API!';
  }

  // Federation: Product'un owner'ı için User referansı dön
  @ResolveField(() => User)
  async owner(@Parent() product: Product): Promise<User> {
    // Federation için sadece referans dönüyoruz
    // Auth API bu id ile User bilgilerini döndürecek
    return { __typename: 'User', id: product.userId } as any;
  }
}
