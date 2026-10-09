import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export interface CreateUserType {
  fullName: string;
  email: string;
  password: string;
}

export class CreateUserDto implements CreateUserType {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
