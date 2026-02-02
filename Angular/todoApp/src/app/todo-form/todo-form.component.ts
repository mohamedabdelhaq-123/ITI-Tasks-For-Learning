import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-todo-form',
  imports: [],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css'
})
export class TodoFormComponent {
  @Output() emitData: EventEmitter<string> = new EventEmitter();  // send iteam to paren


  addItem(val: string) {  // responsible to listen on component when change occur
   // alert(val);
  //  alert("I am working! Value is: " + val); // <--- Add this back
    this.emitData.emit(val);
  };
}
