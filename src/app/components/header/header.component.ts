import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';

import { TodoInputComponent } from '../todo-input/todo-input.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }
  toggleAll() {
    this.todoService.toggleAll();
  }
}
