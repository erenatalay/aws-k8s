import { Injectable, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nService } from 'src/i18n/i18n.service';

@Injectable()
export class SwaggerService {
  constructor(private readonly i18nService: I18nService) {}

  setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
      .setTitle(this.i18nService.translate('swagger.title'))
      .setDescription(this.i18nService.translate('swagger.description'))
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  }
}
