import { IsEmail, IsOptional, IsUUID } from 'class-validator';

export default class User {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsEmail()
  username: string;
}
