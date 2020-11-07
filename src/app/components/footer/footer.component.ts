import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Filter, FilterButton } from 'src/app/models/filtering.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  filterButtons: FilterButton[] = [
    { type: Filter.All, label: 'All', isActive: true },
    { type: Filter.Active, label: 'Aactive', isActive: false },
    { type: Filter.Compeleted, label: 'Completed', isActive: false },
  ];

  length = 0;
  destroy$: Subject<null> = new Subject<null>();
  hasCompleted$: Observable<boolean>;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.hasCompleted$ = this.todoService.todos$.pipe(
      map(todos => todos.some(t => t.isCompleted)),
      takeUntil(this.destroy$)
    );

    this.todoService.length$.pipe(takeUntil(this.destroy$)).subscribe(length => {
      this.length = length;
    });
  }

  deleteCompleted() {
    this.todoService.deleteCompleted();
  }
  filterTodos(type: Filter) {
    this.todoService.filterTodos(type);
  }

  private setActiveBtn(type: Filter) {
    this.filterButtons.forEach(btn => {
      btn.isActive = btn.type === type;
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
