import { IsIn, IsOptional } from "class-validator";
import { taskFilters, taskSortOptions } from "@justdoit/shared";
import type { TaskFilter, TaskSortBy } from "@justdoit/shared";

export class ListTasksQueryDto {
  @IsOptional()
  @IsIn(taskFilters)
  status?: TaskFilter;

  @IsOptional()
  @IsIn(taskSortOptions)
  sortBy?: TaskSortBy;
}
