import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Todo, UpdateTodoRequest } from "../../models/todo.interface";

@Component({
  selector: "app-todo-item",
  template: `
    <div class="todo-item group">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 flex-1">
          <!-- Checkbox -->
          <input
            type="checkbox"
            [checked]="todo().completed"
            (change)="onToggleComplete()"
            class="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
          />

          <!-- Todo content -->
          <div class="flex-1 min-w-0">
            @if (!isEditing()) {
              <div class="cursor-pointer" (dblclick)="startEditing()">
                <h3
                  class="text-sm font-medium"
                  [class.line-through]="todo().completed"
                  [class.text-gray-500]="todo().completed"
                >
                  {{ todo().title }}
                </h3>
                @if (todo().description) {
                  <p
                    class="text-xs text-gray-600 mt-1"
                    [class.line-through]="todo().completed"
                  >
                    {{ todo().description }}
                  </p>
                }
              </div>
            } @else {
              <div class="space-y-2">
                <input
                  #titleInput
                  type="text"
                  [value]="editTitle()"
                  (input)="editTitle.set(titleInput.value)"
                  (keydown.enter)="saveEdit()"
                  (keydown.escape)="cancelEdit()"
                  (blur)="saveEdit()"
                  class="input-field text-sm"
                  placeholder="Todo title..."
                />
                <textarea
                  #descInput
                  [value]="editDescription()"
                  (input)="editDescription.set(descInput.value)"
                  (keydown.enter)="$any($event).ctrlKey && saveEdit()"
                  (keydown.escape)="cancelEdit()"
                  class="input-field text-xs resize-none"
                  rows="2"
                  placeholder="Description (optional)..."
                ></textarea>
              </div>
            }
          </div>
        </div>

        <!-- Priority indicator and actions -->
        <div class="flex items-center space-x-2">
          <!-- Priority badge -->
          <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            [class]="getPriorityClasses()"
          >
            {{ todo().priority }}
          </span>

          <!-- Priority selector (when editing) -->
          @if (isEditing()) {
            <select
              [value]="editPriority()"
              (change)="editPriority.set($any($event.target).value)"
              class="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          }

          <!-- Action buttons -->
          <div
            class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            @if (!isEditing()) {
              <button
                (click)="startEditing()"
                class="p-1 text-gray-400 hover:text-primary-500 transition-colors"
                title="Edit todo"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            } @else {
              <button
                (click)="saveEdit()"
                class="p-1 text-green-500 hover:text-green-600 transition-colors"
                title="Save changes"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <button
                (click)="cancelEdit()"
                class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Cancel editing"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            }

            <button
              (click)="onDelete()"
              class="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete todo"
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
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Timestamps -->
      <div class="mt-3 flex justify-between text-xs text-gray-500">
        <span>Created: {{ formatDate(todo().createdAt) }}</span>
        @if (todo().updatedAt.getTime() !== todo().createdAt.getTime()) {
          <span>Updated: {{ formatDate(todo().updatedAt) }}</span>
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

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
}
