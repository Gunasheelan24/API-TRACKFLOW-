import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { TaskStatus } from '../types/Task.type';

export class GetTasksQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
