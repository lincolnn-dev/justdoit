import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { ListTasksResponse } from "@justdoit/shared";
import { TaskEntity } from "../domain/task.entity.js";
import {
  TASKS_REPOSITORY,
  type TaskListParams,
  type TasksRepository,
} from "../domain/tasks.repository.js";
import type { CreateTaskDto } from "../dto/create-task.dto.js";
import type { ToggleTaskStatusDto } from "../dto/toggle-task-status.dto.js";
import type { UpdateTaskDto } from "../dto/update-task.dto.js";

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_REPOSITORY)
    private readonly tasksRepository: TasksRepository,
  ) {}

  async create(input: CreateTaskDto) {
    const task = TaskEntity.create({
      id: randomUUID(),
      title: input.title,
      description: input.description,
      priority: input.priority ?? "medium",
    });

    const created = await this.tasksRepository.create(task);
    return created.toDTO();
  }

  async list(params: TaskListParams): Promise<ListTasksResponse> {
    const items = await this.tasksRepository.findAll(params);

    return {
      items: items.map((task) => task.toDTO()),
      total: items.length,
    };
  }

  async update(id: string, input: UpdateTaskDto) {
    const existing = await this.tasksRepository.findById(id);

    if (!existing) {
      throw new NotFoundException("Task not found");
    }

    const updated = existing.update(input);
    const persisted = await this.tasksRepository.update(updated);
    return persisted.toDTO();
  }

  async toggle(id: string, input: ToggleTaskStatusDto) {
    const existing = await this.tasksRepository.findById(id);

    if (!existing) {
      throw new NotFoundException("Task not found");
    }

    const updated = existing.toggle(input.completed);
    const persisted = await this.tasksRepository.update(updated);
    return persisted.toDTO();
  }

  async remove(id: string) {
    const existing = await this.tasksRepository.findById(id);

    if (!existing) {
      throw new NotFoundException("Task not found");
    }

    await this.tasksRepository.delete(id);
    return { success: true };
  }
}

