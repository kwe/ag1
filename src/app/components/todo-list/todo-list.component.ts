import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../../models/todo.interface";
import { DemoDataService } from "../../services/demo-data";
import { TodoService } from "../../services/todo.service";
import { TodoItemComponent } from "../todo-item/todo-item.component";

type FilterType = "all" | "active" | "completed";

@Component({
  selector: "app-todo-list",
  template: `
    <div class="max-w-4xl mx-auto p-6 relative">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-glow"
        >
          <svg
            class="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h1
          class="text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3"
        >
          TodoFlow
        </h1>
        <p class="text-xl text-gray-600 font-light">
          Transform your productivity with elegant task management
        </p>
      </div>

      <!-- Add new todo form -->
      <div class="card mb-8 animate-slide-up">
        <div class="card-header">
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-500 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">Create New Task</h2>
          </div>
        </div>
        <div class="card-body">
          <form (ngSubmit)="addTodo()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Task Title</label
              >
              <input
                #titleInput
                type="text"
                [value]="newTodoTitle()"
                (input)="newTodoTitle.set(titleInput.value)"
                placeholder="What would you like to accomplish?"
                class="input-field"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Description</label
              >
              <textarea
                #descInput
                [value]="newTodoDescription()"
                (input)="newTodoDescription.set(descInput.value)"
                placeholder="Add more details about this task..."
                rows="3"
                class="input-field resize-none"
              ></textarea>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <label class="text-sm font-medium text-gray-700"
                  >Priority:</label
                >
                <select
                  [value]="newTodoPriority()"
                  (change)="newTodoPriority.set($any($event.target).value)"
                  class="priority-select"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
              </div>
              <button
                type="submit"
                [disabled]="!newTodoTitle().trim()"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span class="flex items-center space-x-2">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  <span>Add Task</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Stats and filters -->
      <div class="card mb-8 animate-slide-up" style="animation-delay: 0.1s">
        <div class="card-body">
          <div
            class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0"
          >
            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4">
              <div class="stats-card">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-600 font-medium">Total Tasks</p>
                  <p class="text-lg font-bold text-gray-900">
                    {{ todoService.todoCount() }}
                  </p>
                </div>
              </div>

              <div class="stats-card">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-600 font-medium">Active</p>
                  <p class="text-lg font-bold text-amber-600">
                    {{ todoService.activeCount() }}
                  </p>
                </div>
              </div>

              <div class="stats-card">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-600 font-medium">Completed</p>
                  <p class="text-lg font-bold text-emerald-600">
                    {{ todoService.completedCount() }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-2">
              @for (filter of filters; track filter) {
              <button
                (click)="currentFilter.set(filter)"
                class="filter-button"
                [class]="getFilterClasses(filter)"
              >
                {{ getFilterLabel(filter) }}
              </button>
              }
            </div>
          </div>

          <!-- Bulk actions -->
          @if (todoService.todoCount() > 0) {
          <div
            class="mt-6 pt-6 border-t border-gray-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
          >
            <div class="flex flex-wrap gap-3">
              <button
                (click)="todoService.toggleAll()"
                class="btn-secondary text-sm"
              >
                <span class="flex items-center space-x-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>{{
                    allCompleted() ? "Mark all incomplete" : "Mark all complete"
                  }}</span>
                </span>
              </button>
            </div>

            @if (todoService.completedCount() > 0) {
            <button
              (click)="todoService.clearCompleted()"
              class="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
              <span>Clear completed ({{ todoService.completedCount() }})</span>
            </button>
            }
          </div>
          } @else {
          <div
            class="mt-6 pt-6 border-t border-gray-200/50 flex justify-center"
          >
            <button
              (click)="demoDataService.addDemoTodos()"
              class="btn-primary text-sm"
            >
              <span class="flex items-center space-x-2">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                <span>Load Demo Tasks</span>
              </span>
            </button>
          </div>
          }
        </div>
      </div>

      <!-- Todo list -->
      <div class="space-y-4">
        @if (filteredTodos().length === 0) {
        <div class="empty-state animate-fade-in">
          @if (todoService.todoCount() === 0) {
          <div class="text-gray-400">
            <svg
              class="empty-state-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 class="text-2xl font-semibold mb-3 text-gray-600">
              Ready to get organized?
            </h3>
            <p class="text-lg text-gray-500 mb-6">
              Create your first task above and start your productive journey!
            </p>
            <div
              class="flex items-center justify-center space-x-2 text-sm text-gray-400"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Tip: Double-click any task to edit it</span>
            </div>
          </div>
          } @else {
          <div class="text-gray-400">
            <svg
              class="empty-state-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <h3 class="text-2xl font-semibold mb-3 text-gray-600">
              No {{ currentFilter() }} tasks found
            </h3>
            <p class="text-lg text-gray-500">
              Try switching to a different filter or create a new task!
            </p>
          </div>
          }
        </div>
        } @else { @for (todo of filteredTodos(); track todo.id; let i = $index)
        {
        <div class="animate-slide-up" [style.animation-delay]="i * 50 + 'ms'">
          <app-todo-item
            [todo]="todo"
            (toggleComplete)="todoService.toggleTodo($event)"
            (updateTodo)="onUpdateTodo($event)"
            (deleteTodo)="todoService.deleteTodo($event)"
          />
        </div>
        } }
      </div>

      <!-- Footer info -->
      @if (todoService.todoCount() > 0) {
      <div class="mt-12 text-center">
        <div
          class="inline-flex items-center space-x-6 text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-200/50"
        >
          <div class="flex items-center space-x-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
            <span>Double-click to edit</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Ctrl+Enter to save</span>
          </div>
        </div>
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
    "medium"
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
    return isActive ? "filter-button-active" : "filter-button-inactive";
  }

  protected getFilterLabel(filter: FilterType): string {
    const labels = {
      all: "📋 All Tasks",
      active: "⏳ Active",
      completed: "✅ Completed",
    };
    return labels[filter];
  }

  private resetForm(): void {
    this.newTodoTitle.set("");
    this.newTodoDescription.set("");
    this.newTodoPriority.set("medium");
  }
}
