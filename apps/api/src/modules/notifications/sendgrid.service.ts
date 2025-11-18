import { Injectable, Logger } from '@nestjs/common';

let sgMail: any = null;
try {
  // Use require to avoid TypeScript compile issues when dependency isn't installed
  // This keeps the service optional at runtime if @sendgrid/mail is missing.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  sgMail = require('@sendgrid/mail');
} catch (e) {
  sgMail = null;
}

@Injectable()
export class SendGridService {
  private readonly logger = new Logger(SendGridService.name);
  private readonly enabled: boolean;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY || '';
    this.enabled = !!apiKey && !!sgMail;
    if (!apiKey) this.logger.log('SendGrid API key not found, notifications disabled');
    if (!sgMail) this.logger.log('@sendgrid/mail not installed; notifications disabled');
    if (this.enabled) {
      try {
        sgMail.setApiKey(apiKey);
        this.logger.log('SendGrid initialized');
      } catch (e) {
        this.logger.warn('Failed to initialize SendGrid, notifications disabled');
      }
    }
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    if (!this.enabled) {
      this.logger.debug(`Would send email to ${to}: ${subject}`);
      return;
    }
    try {
      const msg: any = {
        to,
        from: process.env.EMAIL_FROM || 'no-reply@example.com',
        subject,
        text,
      };
      if (html) msg.html = html;
      await sgMail.send(msg);
      this.logger.log(`Sent notification to ${to}`);
    } catch (err) {
      this.logger.warn('SendGrid send failed: ' + (err as any)?.message);
    }
  }
}
