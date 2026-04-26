import type { TaskFilter, TaskSortBy } from "@justdoit/shared";
import { TaskEntity } from "./task.entity.js";

export interface TaskListParams {
  status?: TaskFilter;
  sortBy?: TaskSortBy;
}

export interface TasksRepository {
  create(task: TaskEntity): Promise<TaskEntity>;
  findAll(params: TaskListParams): Promise<TaskEntity[]>;
  findById(id: string): Promise<TaskEntity | null>;
  update(task: TaskEntity): Promise<TaskEntity>;
  delete(id: string): Promise<void>;
}

export const TASKS_REPOSITORY = Symbol("TASKS_REPOSITORY");

