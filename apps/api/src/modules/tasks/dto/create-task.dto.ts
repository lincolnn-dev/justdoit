import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { taskPriorities } from "@justdoit/shared";
import type { TaskPriority } from "@justdoit/shared";

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  description?: string;

  @IsOptional()
  @IsIn(taskPriorities)
  priority?: TaskPriority;
}
