import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {} // DI Container inject repository of the entity to do crud operations
  // private todos: todoType[] = [];

  async getTodos() {
    // return this.todos;
    return await this.todoRepository.find();
  }

  // getTodoById(id: number){
  //   const todo = this.todos.find((todo) => todo.id === id);
  //   if (!todo) throw new NotFoundException('Todo not found');
  //   return todo;
  // }

  async getTodoById(id: number) {
    const todo = await this.todoRepository.findOneBy({ id: id });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  // addTodo(newUser: CreateTodoDto): string {
  //   // if (
  //   //   newStatus !== 'todo' &&
  //   //   newStatus !== 'in-progress' &&
  //   //   newStatus !== 'done'
  //   // )
  //   //   throw new NotFoundException('Invalid Status');
  //   const nextId = this.todos.length
  //     ? this.todos[this.todos.length - 1].id + 1
  //     : 1;
  //   this.todos.push({
  //     id: nextId,
  //     task: newUser.task,
  //     status: newUser.status,
  //   });
  //   return `${this.todos[nextId - 1].task} added successfully`;
  // }

  async addTodo(newTodo: CreateTodoDto) {
    const todo = this.todoRepository.create({
      task: newTodo.task,
      status: newTodo.status,
    });
    await this.todoRepository.save(todo);
    return `${newTodo.task} added Successfully`;
  }

  // updateTodo(newtodo: UpdateTodoDto, id: number): string {
  //   const todo = this.todos[id - 1];
  //   if (!todo) throw new NotFoundException('Todo not found');
  //   // if (
  //   //   newtodo.status !== 'todo' &&
  //   //   newtodo.status !== 'in-progress' &&
  //   //   newtodo.status !== 'done'
  //   // )
  //   //   throw new BadRequestException('Invalid Status');
  //   if (newtodo.status !== undefined) todo.status = newtodo.status;
  //   if (newtodo.task !== undefined) todo.task = newtodo.task;
  //   return `${todo.task} with Status ${todo.status} Modified successfully`;
  // }

  async updateTodo(newtodo: UpdateTodoDto, id: number) {
    // const todo = await this.todoRepository.findOneBy({id: id});
    const todo = await this.todoRepository.preload({ id: id, ...newtodo });
    if (!todo) throw new NotFoundException('Todo not found');
    // if (newtodo.status !== undefined) await this.todoRepository.update({id:id}, {status: newtodo.status});
    // if (newtodo.task !== undefined) await this.todoRepository.update({id:id}, {task: newtodo.task});
    await this.todoRepository.save(todo);
    return `${todo.task} with Status ${todo.status} Modified successfully`;
  }

  // deleteTodo(id: number): string {
  //   const todo = this.todos[id - 1];
  //   if (!todo) throw new NotFoundException('Todo Not Found');
  //   this.todos.splice(id - 1, 1);
  //   return 'TODO Deleted Successfully';
  // }

  async deleteTodo(id: number) {
    const todo = await this.todoRepository.findOneBy({ id: id });
    if (!todo) throw new NotFoundException('Todo Not Found');
    await this.todoRepository.delete(id); // del response (red. db calls)
    return 'TODO Deleted Successfully';
  }
}

// Services is for business logic
