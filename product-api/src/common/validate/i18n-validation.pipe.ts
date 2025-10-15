import { I18nService } from 'src/i18n/i18n.service';
import {
  ValidationPipe,
  ValidationPipeOptions,
  ValidationError,
  HttpStatus,
  UnprocessableEntityException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class I18nValidationPipe extends ValidationPipe {
  constructor(
    private readonly i18nService: I18nService,
    options?: ValidationPipeOptions,
  ) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: this.generateTranslatedErrors(errors),
          message: 'common.error.unprocessable.entity.exception',
        });
      },
      ...options,
    });
  }

  private generateTranslatedErrors(errors: ValidationError[]) {
    return errors.reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.property]:
          (currentValue.children?.length ?? 0) > 0
            ? this.generateTranslatedErrors(currentValue.children ?? [])
            : this.translateErrorMessages(currentValue.constraints ?? {}),
      }),
      {},
    );
  }

  private translateErrorMessages(constraints: Record<string, string>): string {
    if (Object.keys(constraints).length === 0) {
      return '';
    }

    const translatedMessages = Object.values(constraints).map(message => 
      this.translateErrorMessage(message)
    );
    
    return translatedMessages.join(', ');
  }

  private translateErrorMessage(message: string): string {
    if (message.includes('.')) {
      let translationKey = message;
      if (!translationKey.startsWith('common.') && !translationKey.startsWith('error.')) {
        translationKey = 'common.' + translationKey;
      }
      
      const translated = this.i18nService.translate(translationKey);
      if (translated && translated !== message) {
        return translated;
      }
    }
    return message;
  }
}