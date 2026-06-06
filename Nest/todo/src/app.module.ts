import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './Todos/todo.module';
import { LoggerMiddleware } from './logger.middelware';
import { TypeOrmModule } from '@nestjs/typeorm';

// decorator to decorate appmodule class to be used in main.ts
@Module({
  // to import other modules to be seen
  imports: [
    TodoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'todo_db',
      autoLoadEntities: true, // auto reg. entities added with forFeature in each module
      synchronize: true, // not recommended in prod. env(delete and create entity if columns changed)
    }), // sync (not whole drop)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'todo', method: RequestMethod.POST });
  }
}

// root module of app
