import { randomUUID } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req, res, next) => {
    const headerValue = req.headers['x-request-id'];
    const requestId =
      typeof headerValue === 'string' && headerValue.length > 0
        ? headerValue
        : randomUUID();

    (req.headers as Record<string, string>)['x-request-id'] = requestId;
    res.setHeader('x-request-id', requestId);

    const startedAt = process.hrtime.bigint();
    res.on('finish', () => {
      const durationMs =
        Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      Logger.log(
        `[${requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`,
      );
    });

    next();
  });

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
