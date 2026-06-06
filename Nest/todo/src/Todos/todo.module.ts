import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
// import controller and service

@Module({
  imports: [TypeOrmModule.forFeature([Todo])], // to register entities in this module to be used in services with @InjectRepository(Entity)
  exports: [],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}

// provider -> injectetable classes
// services is a provider type for business logic
// controllers -> Thin bec, Req. handling & DTOs, Response handling. If used logic can't be reused
// DI container -> memory nestjs store inst. obj.

// DI before -> this.todoservice= new TodoService()
// tight coupling, So need to invert the control
// IoC -> Inversion of Control -> use shorthand in class and let nestjs handle the instnances and injection
// Dependency Resolution -> arrange the depend. in the right order and inject them in the right place

// DI Container Flow: (done once at the start of the app)
// 1. nest read appmodule
// 2. scan modules, providers and @injectable classes
// 3. use metadata of each provider for the graph design
// 4. make the graph of relations and make the instances (classes that has no relations created firstly)
// 5. store these instances in DI container

// What if there is Circular Dependency?
// Bootstrapping fails
// solution: forwardRef() -> tell nestjs to resolve the dependency later when it is needed and not at the start of the app
