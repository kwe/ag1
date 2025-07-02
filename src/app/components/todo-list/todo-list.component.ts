import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TodoService } from "../../services/todo.service";
import { DemoDataService } from "../../services/demo-data";
import { TodoItemComponent } from "../todo-item/todo-item.component";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../../models/todo.interface";

type FilterType = "all" | "active" | "completed";

@Component({
  selector: "app-todo-list",
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
        <p class="text-gray-600">Stay organized and productive</p>
      </div>

      <!-- Add new todo form -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
      >
        <h2 class="text-lg font-semibold mb-4">Add New Todo</h2>
        <form (ngSubmit)="addTodo()" class="space-y-4">
          <div>
            <input
              #titleInput
              type="text"
              [value]="newTodoTitle()"
              (input)="newTodoTitle.set(titleInput.value)"
              placeholder="What needs to be done?"
              class="input-field"
              required
            />
          </div>
          <div>
            <textarea
              #descInput
              [value]="newTodoDescription()"
              (input)="newTodoDescription.set(descInput.value)"
              placeholder="Description (optional)"
              rows="3"
              class="input-field resize-none"
            ></textarea>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Priority:</label>
              <select
                [value]="newTodoPriority()"
                (change)="newTodoPriority.set($any($event.target).value)"
                class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button
              type="submit"
              [disabled]="!newTodoTitle().trim()"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Todo
            </button>
          </div>
        </form>
      </div>

      <!-- Stats and filters -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
        >
          <!-- Stats -->
          <div class="flex items-center space-x-6 text-sm text-gray-600">
            <span
              >Total:
              <span class="font-medium text-gray-900">{{
                todoService.todoCount()
              }}</span></span
            >
            <span
              >Active:
              <span class="font-medium text-primary-600">{{
                todoService.activeCount()
              }}</span></span
            >
            <span
              >Completed:
              <span class="font-medium text-green-600">{{
                todoService.completedCount()
              }}</span></span
            >
          </div>

          <!-- Filters -->
          <div class="flex space-x-2">
            @for (filter of filters; track filter) {
              <button
                (click)="currentFilter.set(filter)"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
                [class]="getFilterClasses(filter)"
              >
                {{ filter | titlecase }}
              </button>
            }
          </div>
        </div>

        <!-- Bulk actions -->
        @if (todoService.todoCount() > 0) {
          <div
            class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between"
          >
            <div class="flex space-x-2">
              <button
                (click)="todoService.toggleAll()"
                class="btn-secondary text-sm"
              >
                {{
                  allCompleted()
                    ? "Mark all as incomplete"
                    : "Mark all as complete"
                }}
              </button>
            </div>

            @if (todoService.completedCount() > 0) {
              <button
                (click)="todoService.clearCompleted()"
                class="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear completed ({{ todoService.completedCount() }})
              </button>
            }
          </div>
        } @else {
          <div class="mt-4 pt-4 border-t border-gray-200 flex justify-center">
            <button
              (click)="demoDataService.addDemoTodos()"
              class="btn-primary text-sm"
            >
              Load Demo Data
            </button>
          </div>
        }
      </div>

      <!-- Todo list -->
      <div class="space-y-3">
        @if (filteredTodos().length === 0) {
          <div class="text-center py-12">
            @if (todoService.todoCount() === 0) {
              <div class="text-gray-500">
                <svg
                  class="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 class="text-lg font-medium mb-2">No todos yet</h3>
                <p class="text-sm">Add your first todo above to get started!</p>
              </div>
            } @else {
              <div class="text-gray-500">
                <h3 class="text-lg font-medium mb-2">
                  No {{ currentFilter() }} todos
                </h3>
                <p class="text-sm">Try switching to a different filter</p>
              </div>
            }
          </div>
        } @else {
          @for (todo of filteredTodos(); track todo.id) {
            <app-todo-item
              [todo]="todo"
              (toggleComplete)="todoService.toggleTodo($event)"
              (updateTodo)="onUpdateTodo($event)"
              (deleteTodo)="todoService.deleteTodo($event)"
            />
          }
        }
      </div>

      <!-- Footer info -->
      @if (todoService.todoCount() > 0) {
        <div class="mt-8 text-center text-xs text-gray-500">
          <p>Double-click a todo to edit it</p>
          <p>Press Ctrl+Enter in the description field to save while editing</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TodoItemComponent],
  providers: [DemoDataService],
})
export class TodoListComponent {
  protected readonly todoService = inject(TodoService);
  protected readonly demoDataService = inject(DemoDataService);

  // Form signals
  protected readonly newTodoTitle = signal("");
  protected readonly newTodoDescription = signal("");
  protected readonly newTodoPriority = signal<"low" | "medium" | "high">(
    "medium",
  );

  // Filter signals
  protected readonly currentFilter = signal<FilterType>("all");
  protected readonly filters: FilterType[] = ["all", "active", "completed"];

  // Computed signals
  protected readonly filteredTodos = computed(() => {
    const filter = this.currentFilter();
    const todos = this.todoService.allTodos();

    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  });

  protected readonly allCompleted = computed(() => {
    const todos = this.todoService.allTodos();
    return todos.length > 0 && todos.every((todo) => todo.completed);
  });

  protected addTodo(): void {
    const title = this.newTodoTitle().trim();
    if (!title) return;

    const request: CreateTodoRequest = {
      title,
      description: this.newTodoDescription().trim() || undefined,
      priority: this.newTodoPriority(),
    };

    this.todoService.addTodo(request);
    this.resetForm();
  }

  protected onUpdateTodo(event: {
    id: string;
    updates: UpdateTodoRequest;
  }): void {
    this.todoService.updateTodo(event.id, event.updates);
  }

  protected getFilterClasses(filter: FilterType): string {
    const isActive = this.currentFilter() === filter;
    return isActive
      ? "bg-primary-500 text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }

  private resetForm(): void {
    this.newTodoTitle.set("");
    this.newTodoDescription.set("");
    this.newTodoPriority.set("medium");
  }
}
