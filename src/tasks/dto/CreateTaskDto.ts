import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title!: string;

  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(200, { message: 'Description must not exceed 200 characters' })
  description!: string;
}
