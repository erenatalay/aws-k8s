import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MessageEvent } from '../rabbitmq/rabbitmq.service';

@Controller()
export class ProductConsumerController {
  private readonly logger = new Logger(ProductConsumerController.name);

  @EventPattern('product.created')
  async handleProductCreated(@Payload() data: MessageEvent) {
    this.logger.log('Received product.created event', data);
    
    try {
      // Handle product creation event
      // Update search indexes, cache invalidation, etc.
      
      this.logger.log(`Product creation processed: ${data.data.productId}`);
    } catch (error) {
      this.logger.error('Error processing product creation', error);
    }
  }

  @EventPattern('product.updated')
  async handleProductUpdated(@Payload() data: MessageEvent) {
    this.logger.log('Received product.updated event', data);
    
    try {
      // Handle product update event
      // Update related services, invalidate cache, etc.
      
      this.logger.log(`Product update processed: ${data.data.productId}`);
    } catch (error) {
      this.logger.error('Error processing product update', error);
    }
  }

  @EventPattern('inventory.updated')
  async handleInventoryUpdated(@Payload() data: MessageEvent) {
    this.logger.log('Received inventory.updated event', data);
    
    try {
      // Handle inventory update event
      // Update product availability, send low stock alerts, etc.
      
      this.logger.log(`Inventory update processed: ${data.data.productId}`);
    } catch (error) {
      this.logger.error('Error processing inventory update', error);
    }
  }

  @MessagePattern('product.get-details')
  async getProductDetails(@Payload() data: MessageEvent) {
    this.logger.log('Received product.get-details request', data);
    
    try {
      // Get product details
      // Return product information
      
      return {
        productId: data.data.productId,
        name: 'Sample Product',
        price: 99.99,
        inStock: true,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting product details', error);
      return {
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  @EventPattern('order.placed')
  async handleOrderPlaced(@Payload() data: MessageEvent) {
    this.logger.log('Received order.placed event', data);
    
    try {
      // Handle order placement
      // Update inventory, reserve products, etc.
      
      this.logger.log(`Order processed: ${data.data.orderId}`);
    } catch (error) {
      this.logger.error('Error processing order', error);
    }
  }
}
