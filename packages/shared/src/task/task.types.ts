export const taskStatuses = ["pending", "completed"] as const;
export const taskFilters = ["all", "pending", "completed"] as const;
export const taskSortOptions = ["createdAt", "priority"] as const;
export const taskPriorities = ["low", "medium", "high"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskFilter = (typeof taskFilters)[number];
export type TaskSortBy = (typeof taskSortOptions)[number];
export type TaskPriority = (typeof taskPriorities)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface TaskQuery {
  status?: TaskFilter;
  sortBy?: TaskSortBy;
}

