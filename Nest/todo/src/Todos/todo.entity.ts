import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { statusType } from './todo.interface';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task: string;

  @Column()
  status: statusType;
}

// flow of typeorm
// forRoot(conf. db conn. for app) in app.module.ts (all your data)
// make your entities
// forFeature([entities]) in module.ts (to register entities in this module to be used in services with @InjectRepository(Entity))
// inject repo(entity) in services
//  do crud operations
// (test conn. by running app) if no crash so ok
// app module-> typeorm.forRoot()-> read @Entity -> put Reopository<Entity> in di container-> inject repo in service
// create connection  -> create table if not exist -> use repository in services to do crud operations
