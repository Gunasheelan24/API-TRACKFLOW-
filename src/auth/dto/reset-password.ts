import { IsNotEmpty, IsString } from 'class-validator';

export interface ResetPasswordType {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}
export class ResetPasswordDto implements ResetPasswordType {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  otp!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;
}
