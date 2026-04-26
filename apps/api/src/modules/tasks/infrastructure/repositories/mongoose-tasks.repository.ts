import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, type SortOrder } from "mongoose";
import type { TaskFilter } from "@justdoit/shared";
import { TaskEntity } from "../../domain/task.entity.js";
import type { TaskListParams, TasksRepository } from "../../domain/tasks.repository.js";
import { TaskModel } from "../schemas/task.schema.js";

@Injectable()
export class MongooseTasksRepository implements TasksRepository {
  constructor(@InjectModel(TaskModel.name) private readonly taskModel: Model<TaskModel>) {}

  async create(task: TaskEntity) {
    const created = await this.taskModel.create(task.toPersistence());
    return this.toEntity(created);
  }

  async findAll(params: TaskListParams) {
    const filter = this.buildFilter(params.status);
    const items = await this.taskModel.find(filter).sort(this.buildSort(params.sortBy)).lean();
    return items.map((item) => this.toEntity(item));
  }

  async findById(id: string) {
    const item = await this.taskModel.findOne({ id }).lean();
    return item ? this.toEntity(item) : null;
  }

  async update(task: TaskEntity) {
    const persisted = await this.taskModel
      .findOneAndUpdate({ id: task.toPersistence().id }, task.toPersistence(), { new: true })
      .lean();

    if (!persisted) {
      throw new Error("Task not found");
    }

    return this.toEntity(persisted);
  }

  async delete(id: string) {
    await this.taskModel.deleteOne({ id });
  }

  private buildFilter(status?: TaskFilter) {
    if (!status || status === "all") {
      return {};
    }

    return { status };
  }

  private buildSort(sortBy?: TaskListParams["sortBy"]): Record<string, SortOrder> {
    if (sortBy === "priority") {
      return {
        priorityRank: -1 as SortOrder,
        createdAt: -1 as SortOrder,
      };
    }

    return {
      createdAt: -1 as SortOrder,
    };
  }

  private toEntity(input: {
    id: string;
    title: string;
    description: string;
    priority: string;
    priorityRank?: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date | null;
  }) {
    return new TaskEntity({
      id: input.id,
      title: input.title,
      description: input.description,
      priority: input.priority as "low" | "medium" | "high",
      status: input.status as "pending" | "completed",
      createdAt: new Date(input.createdAt),
      updatedAt: new Date(input.updatedAt),
      completedAt: input.completedAt ? new Date(input.completedAt) : null,
    });
  }
}
