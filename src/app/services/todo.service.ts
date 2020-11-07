import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../models/filtering.model';
import { Todo } from '../models/todo.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private static readonly TodoStorageKey = 'todos';

  private todos: Todo[];
  private filteredTodos: Todo[];
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);

  private currentFilter: Filter = Filter.All;

  private isSellectedAll = true;

  todos$: Observable<Todo[]> = this.displayTodosSubject.asObservable();
  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService: LocalStorageService) { }

  fetchFromLocalStorage() {
    this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    this.filteredTodos = [...this.todos.map(todo => ({ ...todo }))];
    this.updateTodosData();
  }

  updateLocalStorage() {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false);
    this.updateTodosData();
  }

  filterTodos(filter: Filter, isFiltering: boolean = true) {
    this.currentFilter = filter;
    switch (filter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter(todo => !todo.isCompleted);
        break;
      case Filter.Compeleted:
        this.filteredTodos = this.todos.filter(todo => todo.isCompleted);
        break;
      case Filter.All:
        this.filteredTodos = [...this.todos.map(todo => ({ ...todo }))];
    }

    if (isFiltering) this.updateTodosData();

  }

  deleteCompleted() {
    this.todos = this.todos.filter(todo => !todo.isCompleted);
    this.updateLocalStorage();
  }

  addTodo(newTodoContent: string): void {
    const date = new Date(Date.now()).getTime();
    const newTodo = new Todo(date, newTodoContent);

    this.todos.unshift(newTodo);
    this.updateLocalStorage();
  }

  deleteTodo(id: number): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    this.todos.splice(index, 1);
    this.updateLocalStorage();
  }

  changeTodoStatus(id: number): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    this.todos[index].isCompleted = !this.todos[index].isCompleted;
    this.updateLocalStorage();
  }

  editTodo(todo: Todo) {
    const index = this.todos.findIndex(localTodo => localTodo.id === todo.id);
    this.todos[index] = todo;
    this.updateLocalStorage();
  }

  toggleAll() {
    this.todos.forEach(todo => {
      todo.isCompleted = this.isSellectedAll;
    });
    this.isSellectedAll = !this.isSellectedAll;
    this.updateLocalStorage();
  }

  private updateTodosData() {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }

}
