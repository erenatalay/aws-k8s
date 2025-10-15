import * as Handlebars from 'handlebars';
import * as fs from 'node:fs/promises';
import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      const host = this.configService.get<string>('MAIL_HOST');
      const port = this.configService.get<number>('MAIL_PORT') || 587;
      const user = this.configService.get<string>('MAIL_USER');
      const password = this.configService.get<string>('MAIL_PASSWORD');
      
      this.logger.log(`Configuring mail with host: ${host}, port: ${port}`);
      
      if (!host || !user || !password) {
        this.logger.warn('Mail configuration is incomplete. Email sending might not work properly.');
        return;
      }
      
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass: password,
        },
      });
      
      this.logger.log('Mail transporter created successfully');
    } catch (error) {
      this.logger.error(`Failed to create mail transporter: ${error.message}`);
    }
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    if (!this.transporter) {
      await this.createTestAccount();
    }
    
    try {
      let html: string | undefined;
      if (templatePath) {
        const template = await fs.readFile(templatePath, 'utf-8');
        html = Handlebars.compile(template, {
          strict: true,
        })(context);
      }

      const fromName = this.configService.get<string>('MAIL_FROM_NAME') || 'Afterlive';
      const fromEmail = this.configService.get<string>('MAIL_FROM') || 'noreply@afterlive.com';

      const info = await this.transporter!.sendMail({
        ...mailOptions,
        from: mailOptions.from
          ? mailOptions.from
          : `"${fromName}" <${fromEmail}>`,
        html: mailOptions.html ? mailOptions.html : html,
      });
      
      this.logger.log(`Email sent to: ${mailOptions.to}`);
      
      if (this.transporter.options.host === 'smtp.ethereal.email') {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
  
  private async createTestAccount(): Promise<void> {
    try {
      this.logger.warn('Creating Ethereal test account for development');
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      this.logger.log(`Test account created: ${testAccount.user}`);
    } catch (error) {
      this.logger.error(`Failed to create test account: ${error.message}`);
    }
  }
}
