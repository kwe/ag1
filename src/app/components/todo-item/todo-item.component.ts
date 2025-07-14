import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Todo, UpdateTodoRequest } from "../../models/todo.interface";

@Component({
  selector: "app-todo-item",
  template: `
    <div class="todo-item group">
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-4 flex-1 min-w-0">
          <!-- Custom Checkbox -->
          <div class="flex-shrink-0 mt-1">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                [checked]="todo().completed"
                (change)="onToggleComplete()"
                class="sr-only peer"
              />
              <div
                class="w-6 h-6 bg-white border-2 border-gray-300 rounded-lg peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-primary-600 peer-checked:border-primary-500 transition-all duration-300 flex items-center justify-center peer-checked:scale-110"
              >
                <svg
                  class="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </label>
          </div>

          <!-- Todo content -->
          <div class="flex-1 min-w-0">
            @if (!isEditing()) {
            <div class="cursor-pointer" (dblclick)="startEditing()">
              <div class="flex items-center space-x-3 mb-2">
                <h3
                  class="text-lg font-semibold transition-all duration-300"
                  [class.line-through]="todo().completed"
                  [class.text-gray-400]="todo().completed"
                  [class.text-gray-900]="!todo().completed"
                >
                  {{ todo().title }}
                </h3>
                <span
                  class="badge flex-shrink-0"
                  [class]="getPriorityBadgeClass()"
                >
                  {{ getPriorityLabel() }}
                </span>
              </div>
              @if (todo().description) {
              <p
                class="text-gray-600 leading-relaxed transition-all duration-300"
                [class.line-through]="todo().completed"
                [class.text-gray-400]="todo().completed"
              >
                {{ todo().description }}
              </p>
              }
            </div>
            } @else {
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Title</label
                >
                <input
                  #titleInput
                  type="text"
                  [value]="editTitle()"
                  (input)="editTitle.set(titleInput.value)"
                  (keydown.enter)="saveEdit()"
                  (keydown.escape)="cancelEdit()"
                  (blur)="saveEdit()"
                  class="input-field"
                  placeholder="Task title..."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Description</label
                >
                <textarea
                  #descInput
                  [value]="editDescription()"
                  (input)="editDescription.set(descInput.value)"
                  (keydown.enter)="$any($event).ctrlKey && saveEdit()"
                  (keydown.escape)="cancelEdit()"
                  class="input-field resize-none"
                  rows="3"
                  placeholder="Add details about this task..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Priority</label
                >
                <select
                  [value]="editPriority()"
                  (change)="editPriority.set($any($event.target).value)"
                  class="priority-select"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
              </div>
            </div>
            }
          </div>
        </div>

        <!-- Action buttons -->
        <div
          class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-4"
        >
          @if (!isEditing()) {
          <button
            (click)="startEditing()"
            class="icon-button icon-button-edit"
            title="Edit task"
          >
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </button>
          } @else {
          <button
            (click)="saveEdit()"
            class="icon-button icon-button-save"
            title="Save changes"
          >
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
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </button>
          <button
            (click)="cancelEdit()"
            class="icon-button icon-button-cancel"
            title="Cancel editing"
          >
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          }

          <button
            (click)="onDelete()"
            class="icon-button icon-button-delete"
            title="Delete task"
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Timestamps -->
      <div
        class="mt-4 pt-4 border-t border-gray-200/50 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 text-xs text-gray-500"
      >
        <div class="flex items-center space-x-2">
          <svg
            class="w-4 h-4 text-gray-400"
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
          <span>Created {{ formatDate(todo().createdAt) }}</span>
        </div>
        @if (todo().updatedAt.getTime() !== todo().createdAt.getTime()) {
        <div class="flex items-center space-x-2">
          <svg
            class="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
          <span>Updated {{ formatDate(todo().updatedAt) }}</span>
        </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class TodoItemComponent {
  public readonly todo = input.required<Todo>();

  public readonly toggleComplete = output<string>();
  public readonly updateTodo = output<{
    id: string;
    updates: UpdateTodoRequest;
  }>();
  public readonly deleteTodo = output<string>();

  protected readonly isEditing = signal(false);
  protected readonly editTitle = signal("");
  protected readonly editDescription = signal("");
  protected readonly editPriority = signal<"low" | "medium" | "high">("medium");

  protected onToggleComplete(): void {
    this.toggleComplete.emit(this.todo().id);
  }

  protected onDelete(): void {
    this.deleteTodo.emit(this.todo().id);
  }

  protected startEditing(): void {
    this.editTitle.set(this.todo().title);
    this.editDescription.set(this.todo().description || "");
    this.editPriority.set(this.todo().priority);
    this.isEditing.set(true);
  }

  protected saveEdit(): void {
    const title = this.editTitle().trim();
    if (!title) {
      this.cancelEdit();
      return;
    }

    const updates: UpdateTodoRequest = {
      title,
      description: this.editDescription().trim() || undefined,
      priority: this.editPriority(),
    };

    this.updateTodo.emit({ id: this.todo().id, updates });
    this.isEditing.set(false);
  }

  protected cancelEdit(): void {
    this.isEditing.set(false);
    this.editTitle.set("");
    this.editDescription.set("");
    this.editPriority.set("medium");
  }

  protected getPriorityClasses(): string {
    const priority = this.todo().priority;
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  protected getPriorityBadgeClass(): string {
    const priority = this.todo().priority;
    switch (priority) {
      case "high":
        return "badge-high";
      case "medium":
        return "badge-medium";
      case "low":
        return "badge-low";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  protected getPriorityLabel(): string {
    const priority = this.todo().priority;
    switch (priority) {
      case "high":
        return "🔴 High";
      case "medium":
        return "🟡 Medium";
      case "low":
        return "🟢 Low";
      default:
        return priority;
    }
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
}
