import type { Task, TaskPriority, TaskStatus } from "@justdoit/shared";

const priorityRankMap: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

interface TaskEntityProps {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export class TaskEntity {
  constructor(private readonly props: TaskEntityProps) {}

  static create(input: {
    id: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    createdAt?: Date;
  }) {
    const now = input.createdAt ?? new Date();

    return new TaskEntity({
      id: input.id,
      title: input.title.trim(),
      description: input.description?.trim() ?? "",
      priority: input.priority,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    });
  }

  update(input: { title?: string; description?: string; priority?: TaskPriority }) {
    return new TaskEntity({
      ...this.props,
      title: input.title?.trim() ?? this.props.title,
      description: input.description?.trim() ?? this.props.description,
      priority: input.priority ?? this.props.priority,
      updatedAt: new Date(),
    });
  }

  toggle(completed: boolean) {
    const nextStatus: TaskStatus = completed ? "completed" : "pending";

    return new TaskEntity({
      ...this.props,
      status: nextStatus,
      updatedAt: new Date(),
      completedAt: completed ? new Date() : null,
    });
  }

  toPersistence() {
    return {
      id: this.props.id,
      title: this.props.title,
      description: this.props.description,
      priority: this.props.priority,
      priorityRank: priorityRankMap[this.props.priority],
      status: this.props.status,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      completedAt: this.props.completedAt,
    };
  }

  toDTO(): Task {
    return {
      id: this.props.id,
      title: this.props.title,
      description: this.props.description,
      priority: this.props.priority,
      status: this.props.status,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
      completedAt: this.props.completedAt?.toISOString() ?? null,
    };
  }
}
