import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { TasksService } from "./application/tasks.service.js";
import { CreateTaskDto } from "./dto/create-task.dto.js";
import { ListTasksQueryDto } from "./dto/list-tasks-query.dto.js";
import { ToggleTaskStatusDto } from "./dto/toggle-task-status.dto.js";
import { UpdateTaskDto } from "./dto/update-task.dto.js";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() input: CreateTaskDto) {
    return this.tasksService.create(input);
  }

  @Get()
  list(@Query() query: ListTasksQueryDto) {
    return this.tasksService.list(query);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() input: UpdateTaskDto) {
    return this.tasksService.update(id, input);
  }

  @Patch(":id/status")
  toggle(@Param("id") id: string, @Body() input: ToggleTaskStatusDto) {
    return this.tasksService.toggle(id, input);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tasksService.remove(id);
  }
}

