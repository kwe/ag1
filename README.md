# Modern Angular Todo App

A modern, responsive todo application built with Angular 20+ featuring signals, standalone components, and Tailwind CSS.

## Features

- ✨ **Modern Angular 20+** with signals for reactive state management
- 🎨 **Tailwind CSS** for beautiful, responsive styling
- 📱 **Responsive design** that works on all devices
- 💾 **Local storage** for data persistence
- 🎯 **Priority levels** (High, Medium, Low) for todos
- 📝 **Inline editing** with double-click to edit
- 🔍 **Filtering** by status (All, Active, Completed)
- 📊 **Statistics** showing todo counts
- ♿ **Accessible** with proper ARIA labels and keyboard navigation
- 🚀 **Performance optimized** with OnPush change detection

## Technology Stack

- **Framework**: Angular 20+
- **State Management**: Angular Signals
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Build Tool**: Angular CLI with esbuild
- **TypeScript**: Latest version with strict mode

## Quick Start

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm start
   ```

3. **Open your browser** and navigate to `http://localhost:4200`

## Available Scripts

- `pnpm start` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run unit tests
- `pnpm lint` - Run linting

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── todo-item/          # Individual todo item component
│   │   └── todo-list/          # Main todo list component
│   ├── models/
│   │   └── todo.interface.ts   # Todo data models
│   ├── services/
│   │   └── todo.service.ts     # Todo state management service
│   ├── app.component.ts        # Root component
│   └── app.routes.ts          # Application routing
├── styles.css                 # Global styles with Tailwind
└── main.ts                    # Application bootstrap
```

## Key Components

### TodoService
- **Signals-based** state management
- **Local storage** persistence
- **Computed signals** for derived state
- **CRUD operations** for todos

### TodoListComponent
- **Add new todos** with title, description, and priority
- **Filter todos** by status
- **Bulk operations** (mark all, clear completed)
- **Statistics display**

### TodoItemComponent
- **Inline editing** with double-click
- **Priority indicators** with color coding
- **Hover actions** for edit/delete
- **Keyboard shortcuts** for editing

## Modern Angular Features Used

- **Standalone Components** - No NgModules required
- **Input/Output Functions** - `input()` and `output()` instead of decorators
- **Signals** - `signal()`, `computed()`, `effect()` for reactive state
- **New Control Flow** - `@if`, `@for`, `@switch` instead of structural directives
- **inject()** - Function-based dependency injection
- **OnPush Change Detection** - Optimized performance

## Styling

The app uses Tailwind CSS with custom components and utilities:

- **Custom color palette** with primary blue theme
- **Responsive design** with mobile-first approach
- **Dark mode ready** (extendable)
- **Accessible components** with proper contrast ratios

## Data Persistence

Todos are automatically saved to browser's local storage:
- **Automatic saving** on every change
- **Data recovery** on page reload
- **Error handling** for storage failures

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or as a starter template.

## Development Notes

This project showcases modern Angular best practices:
- Signals for state management instead of RxJS where appropriate
- Standalone components for better tree-shaking
- Function-based APIs over decorator-based ones
- OnPush change detection for performance
- Tailwind CSS for rapid UI development

Perfect for learning modern Angular or as a foundation for larger applications!