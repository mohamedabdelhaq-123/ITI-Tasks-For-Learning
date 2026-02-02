import { Component, Input } from '@angular/core';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  imports: [TodoFormComponent,TodoListComponent],  // add my children
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'todoApp';
 @Input({required:true}) userItems: string[]=[];  // import done

  receiveItems(val:string)
  {
    // console.log("Parent received:", val); // <--- Add this check
    this.userItems.push(val);
      // this.userItems = this.userItems.concat(val);
  }

  removeItem(index: number) {
  this.userItems.splice(index, 1); 
}
}
