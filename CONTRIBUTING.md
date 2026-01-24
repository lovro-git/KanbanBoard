# Contributing

## Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/KanbanBoard.git
   cd KanbanBoard
   npm install
   npm run dev
   ```

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run preview` — Preview build

## Guidelines

- Use functional components with hooks
- Use CSS Modules with existing CSS variables
- Support dark mode via `[data-theme="dark"]`
- Test keyboard navigation and mobile

## Pull Requests

1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes
3. Ensure `npm run build` passes
4. Push and open a PR

## Reporting Issues

Include steps to reproduce, expected vs actual behavior, and browser/OS info.
