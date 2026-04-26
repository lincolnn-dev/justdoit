import { IsBoolean } from "class-validator";

export class ToggleTaskStatusDto {
  @IsBoolean()
  completed!: boolean;
}

