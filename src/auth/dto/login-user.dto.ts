import { IsString, IsNotEmpty, MinLength, IsBoolean } from 'class-validator';

export interface LoginType {
  email: string;
  password: string;
  rememberMe: boolean;
}
export class LoginDto implements LoginType {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsBoolean()
  @IsNotEmpty()
  rememberMe!: boolean;
}
