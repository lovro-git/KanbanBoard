# Contributing to Kanban Board

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/KanbanBoard.git
   cd KanbanBoard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:5173 with hot module reloading.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Architecture

### State Management

The app uses React Context with `useReducer` for state management. All state mutations go through the reducer in `src/utils/boardReducer.js`.

To add a new action:

1. Add the action type to `ACTIONS` object in `boardReducer.js`
2. Add the case handler in the `boardReducer` function
3. Add the action creator in `BoardContext.jsx`
4. Export it from the context value object

### Component Structure

Each component follows this pattern:

```
ComponentName/
├── ComponentName.jsx      # Component logic
└── ComponentName.module.css   # Scoped styles
```

Components should be:
- Functional (use hooks, not classes)
- Self-contained with their own styles
- Exported from their index or directly imported

### Styling Guidelines

We use CSS Modules with CSS custom properties defined in `src/index.css`.

**Do:**
- Use existing CSS variables for colors, spacing, and typography
- Follow the naming convention: `.camelCaseClassName`
- Include dark mode support using `[data-theme="dark"]` selector
- Add transitions for interactive elements
- Support touch devices with `@media (hover: none)`

**Don't:**
- Use inline styles
- Create new color values without adding them as variables
- Use `!important`
- Use fixed pixel values for spacing (use `--spacing-*` variables)

### Key CSS Variables

```css
/* Colors */
--color-background
--color-surface
--color-text
--color-text-secondary
--color-accent
--color-border

/* Spacing */
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px

/* Typography */
--font-display: 'Playfair Display'
--font-body: 'DM Sans'

/* Transitions */
--transition-fast: 150ms ease
--transition-normal: 250ms ease
```

## Making Changes

### Adding a New Feature

1. Check existing issues or create one to discuss the feature
2. Create a feature branch from `main`
3. Implement the feature following the existing patterns
4. Test in both light and dark modes
5. Test with keyboard navigation
6. Ensure the build passes: `npm run build`
7. Submit a pull request

### Fixing a Bug

1. Create an issue describing the bug (if one doesn't exist)
2. Create a branch: `git checkout -b fix/brief-description`
3. Write the fix
4. Test that the bug is fixed
5. Submit a pull request referencing the issue

### Code Style

- Use functional components with hooks
- Prefer named exports over default exports (except for pages/App)
- Use destructuring for props
- Keep components focused and small
- Extract reusable logic into custom hooks

## Pull Request Process

1. Update the README.md if you've added features that users should know about
2. Ensure your code follows the existing style
3. Make sure the build passes
4. Write a clear PR description explaining:
   - What changes you made
   - Why you made them
   - How to test them
5. Link any related issues

### PR Title Format

Use a clear, descriptive title:
- `feat: add due date support`
- `fix: prevent duplicate task IDs`
- `docs: update installation instructions`
- `refactor: simplify reducer logic`

## Testing Your Changes

Before submitting a PR, verify:

- [ ] App builds without errors (`npm run build`)
- [ ] Features work in both light and dark mode
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Data persists after page refresh
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile viewport sizes

## Reporting Issues

When reporting bugs, include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and OS version
5. Screenshots if applicable

## Feature Requests

Feature requests are welcome! Please:

1. Check if it's already been requested
2. Explain the use case
3. Consider if it fits the project's scope (simple, local-first, privacy-focused)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn

## Questions?

Open an issue with the "question" label or start a discussion.

Thank you for contributing!
