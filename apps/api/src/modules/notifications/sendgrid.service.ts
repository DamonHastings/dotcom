import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SendGridService {
  private readonly logger = new Logger(SendGridService.name);
  private readonly enabled: boolean;
  private sgMail: any = null;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY || '';

    // Try to require the optional dependency at construction time so that
    // developers who add the package after the server starts (or who haven't
    // installed it) get a clear, recoverable state.
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.sgMail = require('@sendgrid/mail');
    } catch (e) {
      this.sgMail = null;
    }

    this.enabled = !!apiKey && !!this.sgMail;

    if (!apiKey) this.logger.log('SendGrid API key not found, notifications disabled');
    if (!this.sgMail) this.logger.log("@sendgrid/mail not installed; notifications disabled (run 'npm --workspace @apps/api install @sendgrid/mail')");

    if (this.enabled) {
      try {
        this.sgMail.setApiKey(apiKey);
        this.logger.log('SendGrid initialized');
      } catch (e) {
        this.logger.warn('Failed to initialize SendGrid, notifications disabled');
        // If initialization fails, disable sending
        (this as any).enabled = false;
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
      await this.sgMail.send(msg);
      this.logger.log(`Sent notification to ${to}`);
    } catch (err) {
      const e = err as any;
      const msg = e?.message || String(e);
      const status = e?.response?.statusCode ?? e?.statusCode ?? null;
      this.logger.warn(`SendGrid send failed: ${msg}${status ? ` (status ${status})` : ''}`);
      if (e?.response?.body) {
        try {
          this.logger.debug('SendGrid response body: ' + JSON.stringify(e.response.body));
        } catch (jsonErr) {
          this.logger.debug('SendGrid response body (unserializable)');
        }
      }
    }
  }
}
