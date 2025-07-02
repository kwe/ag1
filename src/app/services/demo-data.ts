import { inject } from '@angular/core';
import { TodoService } from './todo.service';

/**
 * Demo data service to populate the app with sample todos
 * Useful for testing and demonstration purposes
 */
export class DemoDataService {
  private readonly todoService = inject(TodoService);

  /**
   * Add sample todos to demonstrate the app functionality
   */
  public addDemoTodos(): void {
    const demoTodos = [
      {
        title: 'Complete Angular signals tutorial',
        description: 'Learn about the new reactive primitives in Angular and how they improve change detection performance',
        priority: 'high' as const
      },
      {
        title: 'Review Tailwind CSS documentation',
        description: 'Update knowledge on utility-first CSS framework and new features',
        priority: 'medium' as const
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment for the project',
        priority: 'high' as const
      },
      {
        title: 'Write unit tests for components',
        description: 'Add comprehensive test coverage for all Angular components using Jasmine and Karma',
        priority: 'medium' as const
      },
      {
        title: 'Optimize bundle size',
        description: 'Analyze and reduce the application bundle size for better performance',
        priority: 'low' as const
      },
      {
        title: 'Add dark mode support',
        description: 'Implement dark/light theme toggle using Tailwind CSS dark mode utilities',
        priority: 'low' as const
      },
      {
        title: 'Implement drag and drop',
        description: 'Add drag and drop functionality to reorder todos and change priorities',
        priority: 'medium' as const
      },
      {
        title: 'Create user authentication',
        description: 'Add login/logout functionality with JWT tokens and route guards',
        priority: 'high' as const
      }
    ];

    // Only add demo data if there are no existing todos
    if (this.todoService.todoCount() === 0) {
      demoTodos.forEach(todo => {
        this.todoService.addTodo(todo);
      });

      // Mark a couple todos as completed for demonstration
      const allTodos = this.todoService.allTodos();
      if (allTodos.length > 2) {
        this.todoService.toggleTodo(allTodos[1].id); // Mark second todo as completed
        this.todoService.toggleTodo(allTodos[4].id); // Mark fifth todo as completed
      }
    }
  }

  /**
   * Clear all todos and reset to empty state
   */
  public clearAllTodos(): void {
    const allTodos = this.todoService.allTodos();
    allTodos.forEach(todo => {
      this.todoService.deleteTodo(todo.id);
    });
  }

  /**
   * Get statistics about the current todos
   */
  public getStats() {
    return {
      total: this.todoService.todoCount(),
      active: this.todoService.activeCount(),
      completed: this.todoService.completedCount(),
      highPriority: this.todoService.allTodos().filter(t => t.priority === 'high').length,
      mediumPriority: this.todoService.allTodos().filter(t => t.priority === 'medium').length,
      lowPriority: this.todoService.allTodos().filter(t => t.priority === 'low').length
    };
  }
}
