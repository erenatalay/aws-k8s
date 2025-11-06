import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';

/**
 * Kafka Message Consumer Controller for Product Service
 * Handles high-volume product and inventory events
 */
@Controller()
export class ProductKafkaController {
  private readonly logger = new Logger(ProductKafkaController.name);

  /**
   * Handle product creation events
   * Topic: product.created
   */
  @MessagePattern('product.created')
  async handleProductCreated(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const topic = context.getTopic();
    const partition = context.getPartition();
    
    this.logger.log(
      `📥 Product created - Topic: ${topic}, Partition: ${partition}, Offset: ${originalMessage.offset}`,
    );

    try {
      const { data } = message;
      
      // Process product creation
      this.logger.log(`✅ Product created: ${data.productId} - ${data.name}`);
      
      return { success: true, productId: data.productId };
    } catch (error) {
      this.logger.error(`❌ Error processing product.created: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Handle product update events
   * Topic: product.updated
   */
  @MessagePattern('product.updated')
  async handleProductUpdated(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const partition = context.getPartition();
    
    this.logger.log(
      `📥 Product updated - Partition: ${partition}, Offset: ${originalMessage.offset}`,
    );

    try {
      const { data } = message;
      
      // Update product cache, search index, etc.
      this.logger.log(`✅ Product updated: ${data.productId}`);
      
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Error processing product.updated: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle inventory updates - HIGH VOLUME EVENT
   * Topic: inventory.updated
   * 
   * This is optimized for high throughput
   */
  @MessagePattern('inventory.updated')
  async handleInventoryUpdate(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const partition = context.getPartition();
    
    this.logger.debug(
      `📦 Inventory update - Partition: ${partition}, Offset: ${originalMessage.offset}`,
    );

    try {
      const { data } = message;
      
      // Fast inventory update
      // await this.inventoryService.updateStock(data.productId, data.quantity);
      
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Error updating inventory: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle bulk product imports
   * Topic: product.import.batch
   * 
   * Optimized for processing thousands of products
   */
  @MessagePattern('product.import.batch')
  async handleBulkImport(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const partition = context.getPartition();
    
    this.logger.log(
      `📦 Bulk import started - Partition: ${partition}, Offset: ${originalMessage.offset}`,
    );

    try {
      const { data } = message;
      const products = data.products || [];
      
      this.logger.log(`Processing bulk import: ${products.length} products`);
      
      // Process in batches for better performance
      const batchSize = 100;
      let processed = 0;
      
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        await this.processBatch(batch);
        processed += batch.length;
        
        // Log progress
        if (processed % 1000 === 0) {
          this.logger.log(`Progress: ${processed}/${products.length} products processed`);
        }
      }
      
      this.logger.log(`✅ Bulk import completed: ${products.length} products`);
      
      return { 
        success: true, 
        imported: products.length,
        batchId: data.batchId,
      };
    } catch (error) {
      this.logger.error(`❌ Error processing bulk import: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle price updates
   * Topic: product.price.updated
   */
  @MessagePattern('product.price.updated')
  async handlePriceUpdate(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    
    this.logger.log(`💰 Price update - Offset: ${originalMessage.offset}`);

    try {
      const { data } = message;
      
      // Update price, invalidate cache, notify subscribers
      this.logger.log(
        `Price updated for ${data.productId}: ${data.oldPrice} → ${data.newPrice}`,
      );
      
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Error updating price: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle search index updates
   * Topic: product.search.index
   * 
   * Updates search engine (Elasticsearch, Algolia, etc.)
   */
  @MessagePattern('product.search.index')
  async handleSearchIndexing(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    
    this.logger.debug(`🔍 Search indexing - Offset: ${originalMessage.offset}`);

    try {
      const { data } = message;
      
      // Update search index
      // await this.searchService.indexProduct(data);
      
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Error indexing product: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle product deletion
   * Topic: product.deleted
   */
  @MessagePattern('product.deleted')
  async handleProductDeleted(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    
    this.logger.log(`🗑️ Product deletion - Offset: ${originalMessage.offset}`);

    try {
      const { data } = message;
      
      // Soft delete or remove from search
      this.logger.log(`Product deleted: ${data.productId}`);
      
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Error deleting product: ${error.message}`);
      throw error;
    }
  }

  /**
   * Helper: Process batch of products
   */
  private async processBatch(batch: any[]): Promise<void> {
    // Simulate batch processing with parallel execution
    await Promise.all(
      batch.map(async (product) => {
        // Process each product
        // await this.productService.create(product);
      }),
    );
  }
}
