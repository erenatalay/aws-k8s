import { Injectable, NotFoundException, Logger } from '@nestjs/common';

import { I18nService } from '../i18n/i18n.service';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  QueryProductDto,
} from './dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly i18nService: I18nService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  /**
   * Create a new product
   */
  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    try {
      // userId kontrolü
      if (!createProductDto.userId) {
        throw new Error('User ID is required');
      }

      this.logger.log(
        `Creating product: ${createProductDto.name} for user: ${createProductDto.userId}`,
      );

      const product = await this.prisma.products.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
          userId: createProductDto.userId,
        },
      });

      // Emit product created event to RabbitMQ
      this.rabbitmqService.emit('product.created', {
        productId: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        createdBy: createProductDto.userId,
        timestamp: new Date(),
      });

      this.logger.log(`Product created successfully with ID: ${product.id}`);
      return product;
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all products with pagination and filters
   */
  async findAll(query: QueryProductDto): Promise<{
    data: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const { search, userId, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (userId) {
        where.userId = userId;
      }

      // Get total count
      const total = await this.prisma.products.count({ where });

      // Get products
      const products = await this.prisma.products.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const totalPages = Math.ceil(total / limit);

      this.logger.log(
        `Retrieved ${products.length} products (page ${page} of ${totalPages})`,
      );

      return {
        data: products,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error(`Error retrieving products: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  async findOne(id: string): Promise<ProductResponseDto> {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(
          this.i18nService.translate('error.PRODUCT_NOT_FOUND'),
        );
      }

      return product;
    } catch (error) {
      this.logger.error(`Error retrieving product ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get products by user ID
   */
  async findByUserId(userId: string): Promise<ProductResponseDto[]> {
    try {
      const products = await this.prisma.products.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      this.logger.log(`Found ${products.length} products for user ${userId}`);
      return products;
    } catch (error) {
      this.logger.error(
        `Error retrieving products for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Update a product
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    try {
      // Check if product exists
      await this.findOne(id);

      const product = await this.prisma.products.update({
        where: { id },
        data: updateProductDto,
      });

      this.logger.log(`Product ${id} updated successfully`);
      return product;
    } catch (error) {
      this.logger.error(`Error updating product ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      // Check if product exists
      await this.findOne(id);

      await this.prisma.products.delete({
        where: { id },
      });

      this.logger.log(`Product ${id} deleted successfully`);
      return {
        message: this.i18nService.translate('common.PRODUCT_DELETED'),
      };
    } catch (error) {
      this.logger.error(`Error deleting product ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get product count by user
   */
  async getProductCountByUser(userId: string): Promise<number> {
    try {
      const count = await this.prisma.products.count({
        where: { userId },
      });

      return count;
    } catch (error) {
      this.logger.error(
        `Error getting product count for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }
}
