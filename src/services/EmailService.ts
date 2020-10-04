import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import Email from '@/data-transfer-object/EmailDto';

@Injectable()
export default class EmailService {
  async sendEmail(email: Email): Promise<boolean> {
    console.log('email', email);
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
      body: `<p>You've activated your account.</p>`,
    } as Email);
  }
}
