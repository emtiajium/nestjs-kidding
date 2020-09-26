import { IsEmail, IsUUID } from 'class-validator';

export default class User {
  @IsUUID()
  id?: string;

  @IsEmail()
  username: string;
}
