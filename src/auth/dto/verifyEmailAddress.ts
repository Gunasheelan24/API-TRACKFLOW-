import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto, CreateUserType } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export type sentEmailtype = Pick<CreateUserType, 'email'> & {
  endpoint: string;
};
export class sentEmailOtp extends PickType(CreateUserDto, ['email']) {
  @IsString()
  @IsNotEmpty()
  endpoint!: string;
}
