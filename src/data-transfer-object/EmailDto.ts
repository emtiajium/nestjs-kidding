import { IsEmail, IsOptional, IsString } from 'class-validator';

export default class Email {
  @IsEmail()
  to: string;

  @IsEmail()
  from: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;

  get html(): string {
    return this.body;
  }
}
