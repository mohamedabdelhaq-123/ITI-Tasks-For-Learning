import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './todo.services';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';

@Controller('todo') // main route is todo // todos----
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  getTodos() {
    return this.todoService.getTodos();
  }

  @Get(':id')
  getTodoById(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.getTodoById(id); // no +id
  }
 // parseint -> error 
  @Post()
  addTodo(
    // @Body('status') newStatus: statusType, // the body has all the object
    // @Body('task') newTask: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todoService.addTodo(createTodoDto);
    // return this.todoService.addTodo(newStatus, newTask);
  }

  @Patch(':id')
  updateTodo(
    @Param('id', ParseIntPipe) id: number,
    // @Body('status') newStatus: statusType,
    // @Body('task') newTask: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.updateTodo(updateTodoDto, id);
  }

  @Delete(':id')
  deleteTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.deleteTodo(id);
  }
}
