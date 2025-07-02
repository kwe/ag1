import { Injectable, signal, computed } from '@angular/core';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly todos = signal<Todo[]>([]);

  // Public computed signals
  public readonly allTodos = computed(() => this.todos());
  public readonly activeTodos = computed(() => this.todos().filter(todo => !todo.completed));
  public readonly completedTodos = computed(() => this.todos().filter(todo => todo.completed));
  public readonly todoCount = computed(() => this.todos().length);
  public readonly activeCount = computed(() => this.activeTodos().length);
  public readonly completedCount = computed(() => this.completedTodos().length);

  constructor() {
    this.loadTodosFromStorage();
  }

  public addTodo(request: CreateTodoRequest): void {
    const newTodo: Todo = {
      id: this.generateId(),
      title: request.title.trim(),
      description: request.description?.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: request.priority || 'medium'
    };

    this.todos.update(todos => [...todos, newTodo]);
    this.saveTodosToStorage();
  }

  public updateTodo(id: string, request: UpdateTodoRequest): void {
    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              ...request,
              title: request.title?.trim() || todo.title,
              description: request.description?.trim() || todo.description,
              updatedAt: new Date()
            }
          : todo
      )
    );
    this.saveTodosToStorage();
  }

  public deleteTodo(id: string): void {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
    this.saveTodosToStorage();
  }

  public toggleTodo(id: string): void {
    this.updateTodo(id, { completed: !this.findTodoById(id)?.completed });
  }

  public clearCompleted(): void {
    this.todos.update(todos => todos.filter(todo => !todo.completed));
    this.saveTodosToStorage();
  }

  public toggleAll(): void {
    const allCompleted = this.allTodos().every(todo => todo.completed);
    this.todos.update(todos =>
      todos.map(todo => ({
        ...todo,
        completed: !allCompleted,
        updatedAt: new Date()
      }))
    );
    this.saveTodosToStorage();
  }

  public getTodosByPriority(priority: 'low' | 'medium' | 'high'): Todo[] {
    return this.allTodos().filter(todo => todo.priority === priority);
  }

  public findTodoById(id: string): Todo | undefined {
    return this.allTodos().find(todo => todo.id === id);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveTodosToStorage(): void {
    try {
      localStorage.setItem('todos', JSON.stringify(this.todos()));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }

  private loadTodosFromStorage(): void {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        // Convert date strings back to Date objects
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }));
        this.todos.set(todosWithDates);
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
      this.todos.set([]);
    }
  }
}
