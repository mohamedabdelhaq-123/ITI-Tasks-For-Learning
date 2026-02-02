import { Component,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {
  @Input() todoListItems:string[]=[];  // recieve from parent the array of iteams

  @Output() deleteEvent = new EventEmitter<number>();
  remove(i:number)
  {
    this.deleteEvent.emit(i);
  }
}
