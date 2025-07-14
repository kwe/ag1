import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden"
    >
      <!-- Background decoration -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5"
      ></div>
      <div
        class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-400/10 to-transparent rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-400/10 to-transparent rounded-full blur-3xl"
      ></div>

      <!-- Content -->
      <div class="relative z-10">
        <router-outlet />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
})
export class AppComponent {
  title = "Modern Todo App";
}
