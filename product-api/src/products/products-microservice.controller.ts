import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';

@Controller()
export class ProductsMicroserviceController {
  private readonly logger = new Logger(ProductsMicroserviceController.name);

  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('product.create')
  async createProduct(@Payload() data: CreateProductDto) {
    this.logger.log('Received product.create message');
    try {
      return await this.productsService.create(data);
    } catch (error) {
      this.logger.error('Error creating product:', error);
      throw error;
    }
  }

  @MessagePattern('product.findAll')
  async findAllProducts(@Payload() query: QueryProductDto) {
    this.logger.log('Received product.findAll message');
    try {
      return await this.productsService.findAll(query);
    } catch (error) {
      this.logger.error('Error finding products:', error);
      throw error;
    }
  }

  @MessagePattern('product.findOne')
  async findOneProduct(@Payload() id: string) {
    this.logger.log(`Received product.findOne message for id: ${id}`);
    try {
      return await this.productsService.findOne(id);
    } catch (error) {
      this.logger.error(`Error finding product ${id}:`, error);
      throw error;
    }
  }

  @MessagePattern('product.update')
  async updateProduct(
    @Payload() data: { id: string; updateData: UpdateProductDto },
  ) {
    this.logger.log(`Received product.update message for id: ${data.id}`);
    try {
      return await this.productsService.update(data.id, data.updateData);
    } catch (error) {
      this.logger.error(`Error updating product ${data.id}:`, error);
      throw error;
    }
  }

  @MessagePattern('product.delete')
  async deleteProduct(@Payload() id: string) {
    this.logger.log(`Received product.delete message for id: ${id}`);
    try {
      return await this.productsService.remove(id);
    } catch (error) {
      this.logger.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  @MessagePattern('product.health')
  async healthCheck() {
    this.logger.log('Received product.health message');
    return { status: 'ok', service: 'product-api' };
  }
}
