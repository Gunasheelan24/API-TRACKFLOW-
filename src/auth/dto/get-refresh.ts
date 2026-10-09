import { IsString, IsNotEmpty } from 'class-validator';

export interface GetRefreshTokenType {
  refreshtoken: string;
}

export class GetRefreshTokenDto implements GetRefreshTokenType {
  @IsString()
  @IsNotEmpty()
  refreshtoken!: string;
}
