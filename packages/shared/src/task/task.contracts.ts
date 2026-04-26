import type { Task, TaskFilter, TaskPriority, TaskSortBy } from "./task.types.js";

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
}

export interface ToggleTaskStatusInput {
  completed: boolean;
}

export interface ListTasksQuery {
  status?: TaskFilter;
  sortBy?: TaskSortBy;
}

export interface ListTasksResponse {
  items: Task[];
  total: number;
}
