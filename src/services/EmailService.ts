import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import Email from '@/data-transfer-object/EmailDto';

// TODO adapter + service
// service should be blind of Sendgrid

@Injectable()
export default class EmailService {
  constructor() {
    sgMail.setApiKey('SG.INVALID_API_KEY');
  }

  async sendEmail(email: Email): Promise<boolean> {
    try {
      await sgMail.send(email);
    } catch (error) {
      if (error.response) {
        throw new Error(`Email error: ${error.response.body.errors[0].message}`);
      }
      throw new Error(`Email error: ${error.message}`);
    }
    return true;
  }

  async sendAccountOpeningEmail(email: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      from: 'test@example.com',
      subject: 'Welcome!',
      html: `<p>You've activated your account.</p>`,
    });
  }
}
