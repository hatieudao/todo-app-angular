import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {

  @Input() todo: Todo;

  @Output() deleteTodo: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() changeStatus: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() editTodoItem: EventEmitter<Todo> = new EventEmitter<Todo>();

  isHovered = false;
  isEdit = false;
  checkboxValue: boolean;
  constructor() { }

  ngOnInit(): void {
    this.checkboxValue = this.todo.isCompleted;
  }

  removeTodo(): void {
    this.deleteTodo.emit(this.todo);
  }
  activeTodo(event: any): void {
    this.changeStatus.emit(this.todo);
  }
  editTodo() {
    this.editTodoItem.emit(this.todo);
    this.isEdit = false;
  }
}
