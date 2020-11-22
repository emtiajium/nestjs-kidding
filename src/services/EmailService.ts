import * as sgMail from '@sendgrid/mail';
import Email from '@/data-transfer-object/EmailDto';
import EmailException from '@/exceptions/EmailException';

export default class EmailService {
  constructor() {
    sgMail.setApiKey('SG.INVALID_API_KEY');
  }

  async sendEmail(email: Email): Promise<boolean> {
    try {
      await sgMail.send(email);
    } catch (error) {
      throw new EmailException(
        'Something went wrong!',
        error.response ? error.response.body.errors[0].message : error.message,
      );
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
