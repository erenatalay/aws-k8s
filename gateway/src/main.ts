import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: true,
    credentials: true,
  });

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT);

  Logger.log(`🚀 Gateway is running on: http://localhost:${PORT}/graphql`);
  Logger.log(`📚 GraphQL Playground: http://localhost:${PORT}/graphql`);
}
bootstrap();
