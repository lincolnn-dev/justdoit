import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TasksService } from "./application/tasks.service.js";
import { TASKS_REPOSITORY } from "./domain/tasks.repository.js";
import { MongooseTasksRepository } from "./infrastructure/repositories/mongoose-tasks.repository.js";
import { TaskModel, TaskSchema } from "./infrastructure/schemas/task.schema.js";
import { TasksController } from "./tasks.controller.js";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TaskModel.name, schema: TaskSchema }]),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    MongooseTasksRepository,
    {
      provide: TASKS_REPOSITORY,
      useExisting: MongooseTasksRepository,
    },
  ],
})
export class TasksModule {}

