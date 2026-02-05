import { IsEmail, isString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @isString()
  @MinLength(6)
  password: string;
}
