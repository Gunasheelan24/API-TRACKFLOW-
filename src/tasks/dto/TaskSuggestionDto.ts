import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class TaskSuggestionDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(3, 200)
  title!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
