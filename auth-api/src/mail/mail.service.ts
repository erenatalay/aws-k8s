import { I18nContext } from 'nestjs-i18n';
import * as path from 'path'; // DÜZELTME: path modülünü doğru içe aktarın
import { MaybeType } from 'src/utils/types/maybe.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailerService } from '../mailer/mailer.service';
import { MailData } from './interfaces/mail-data.interface';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.confirmEmail'),
        i18n.t('confirm-email.text1'),
        i18n.t('confirm-email.text2'),
        i18n.t('confirm-email.text3'),
      ]);
    }

    const workingDirectory = process.cwd();

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle || 'Email Confirmation',
      text: `${emailConfirmTitle || 'Email Confirmation'} - Activation Code: ${mailData.data.hash}`,
      templatePath: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'activation.hbs',
      ),
      context: {
        title: emailConfirmTitle || 'Email Confirmation',
        actionTitle: emailConfirmTitle || 'Email Confirmation',
        app_name: this.configService.get('MAIL_FROM_NAME') || 'Afterlive',
        text1: 'Please confirm your email',
        text2: 'Thank you for registering with',
        text3: 'Your activation code is:',
        hash: mailData.data.hash,
      },
    });
  }

  async forgotPassword(
    mailData: MailData<{ hash: string; tokenExpires: number }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    let text4: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3, text4] = await Promise.all([
        i18n.t('common.resetPassword'),
        i18n.t('reset-password.text1'),
        i18n.t('reset-password.text2'),
        i18n.t('reset-password.text3'),
        i18n.t('reset-password.text4'),
      ]);
    }

    const frontendUrl = this.configService.get<string>('APP_FRONTEND_DOMAIN') || 'http://localhost:3000';
    
    const resetUrl = `${frontendUrl}/auth/reset-password?email=${encodeURIComponent(mailData.to)}&code=${mailData.data.hash}`;
    
    const workingDirectory = process.cwd();

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle || 'Reset Your Password',
      text: `${resetPasswordTitle || 'Reset Your Password'} - Reset Code: ${mailData.data.hash}`,
      templatePath: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'reset-password.hbs',
      ),
      context: {
        title: resetPasswordTitle || 'Reset Your Password',
        url: resetUrl,
        actionTitle: resetPasswordTitle || 'Reset Your Password',
        app_name: this.configService.get('MAIL_FROM_NAME') || 'Afterlive',
        text1: text1 || 'You have requested to reset your password',
        text2: text2 || 'Please use the button below to reset your password',
        text3: text3 || 'Or use this reset code:',
        text4: text4 || 'If you did not request a password reset, please ignore this email',
        hash: mailData.data.hash,
        expires: new Date(mailData.data.tokenExpires).toLocaleString(),
      },
    });
  }

  async confirmNewEmail(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.confirmEmail'),
        i18n.t('confirm-new-email.text1'),
        i18n.t('confirm-new-email.text2'),
        i18n.t('confirm-new-email.text3'),
      ]);
    }

    const url = new URL('/confirm-new-email');
    url.searchParams.set('hash', mailData.data.hash);

    const workingDirectory = process.cwd();

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'confirm-new-email.hbs',
      ),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        hash: mailData.data.hash,
        app_name: this.configService.get('app.name', { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }
}
