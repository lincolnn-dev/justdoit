import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { taskPriorities, taskStatuses } from "@justdoit/shared";

export type TaskDocument = HydratedDocument<TaskModel>;

@Schema({
  collection: "tasks",
  versionKey: false,
})
export class TaskModel {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, trim: true, maxlength: 80 })
  title!: string;

  @Prop({ default: "", trim: true, maxlength: 240 })
  description!: string;

  @Prop({ required: true, enum: taskStatuses, default: "pending" })
  status!: string;

  @Prop({ required: true, enum: taskPriorities, default: "medium" })
  priority!: string;

  @Prop({ required: true, default: 2 })
  priorityRank!: number;

  @Prop({ type: Date, required: true })
  createdAt!: Date;

  @Prop({ type: Date, required: true })
  updatedAt!: Date;

  @Prop({ type: Date, default: null })
  completedAt!: Date | null;
}

export const TaskSchema = SchemaFactory.createForClass(TaskModel);
TaskSchema.index({ status: 1, createdAt: -1 });
TaskSchema.index({ priorityRank: -1, createdAt: -1 });
