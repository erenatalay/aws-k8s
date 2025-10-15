import { Module } from '@nestjs/common';
import { I18nHelperModule } from 'src/i18n/i18n.module';
import { SwaggerService } from './swagger.service';

@Module({
  imports: [I18nHelperModule],
  providers: [SwaggerService],
  exports: [SwaggerService],
})
export class SwaggerModule {}
