import { IsEnum, IsString } from 'class-validator';
import { statusType } from '../todo.interface';

export class CreateTodoDto {
  //body of req. -> task, status

  @IsString()
  task: string;

  @IsEnum(statusType)
  status: statusType;
}

// biggest issue that in runtime ts types are not valid, so need DTO
// Eliminate custom validation in controllers
// apply rules before controller if passed -> cont. else -> throw error
// Mandatory to let dto & pipes work to add app.useGlobalPipes(new ValidationPipe()) in main.ts
// issue of extra fields can be solved by whitlist  or forbidNonWhitelisted in main.ts
