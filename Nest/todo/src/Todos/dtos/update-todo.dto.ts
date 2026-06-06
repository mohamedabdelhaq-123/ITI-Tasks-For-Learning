import { IsEnum, IsOptional, IsString } from 'class-validator';
import { statusType } from '../todo.interface';

export class UpdateTodoDto {
  //body of req. -> task, status

  @IsString()
  @IsOptional()
  task?: string;

  @IsEnum(statusType)
  @IsOptional() // optionality for runtime
  status?: statusType; // the ? more optional layer for ts (compile time)
}
// len, emptystr
