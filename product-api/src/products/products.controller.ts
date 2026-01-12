import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  CurrentUser,
  CurrentUserData,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { I18nService } from '../i18n/i18n.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  QueryProductDto,
} from './dto';
import { ProductsService } from './products.service';

@Controller({ path: 'products', version: '1' })
@ApiTags('Products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private readonly productsService: ProductsService,
    private readonly i18nService: I18nService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new product (Protected by JWT)',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiBody({ type: CreateProductDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ProductResponseDto> {
    this.logger.log(
      `POST /products - Creating new product by user: ${user.email}`,
    );


    createProductDto.userId = user.userId;

    return await this.productsService.create(createProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all products with pagination and filters (Protected by JWT)',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryProductDto) {
    this.logger.log('GET /products - Retrieving products');
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product by ID (Protected by JWT)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    this.logger.log(`GET /products/${id} - Retrieving product`);
    return await this.productsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get products by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<ProductResponseDto[]> {
    this.logger.log(`GET /products/user/${userId} - Retrieving user products`);
    return await this.productsService.findByUserId(userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (Protected by JWT)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ProductResponseDto> {
    this.logger.log(
      `PUT /products/${id} - Updating product by user: ${user.email}`,
    );
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (Protected by JWT)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ message: string }> {
    this.logger.log(
      `DELETE /products/${id} - Deleting product by user: ${user.email}`,
    );
    return await this.productsService.remove(id);
  }
}
