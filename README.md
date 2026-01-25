# Kanban Board

A lightweight, open-source Kanban board that runs entirely in your browser. No accounts, no servers, no tracking — just a clean interface to manage your tasks locally.

## Features

### Core
- **Three-column workflow** — To Do, In Progress, Done
- **Drag and drop** — Move tasks between columns or reorder within
- **Create, edit, delete** — Full task management with title and description
- **Persistent storage** — Tasks are saved to localStorage and survive browser refreshes
- **Dark/light mode** — Toggle themes or let it follow your system preference
- **Keyboard accessible** — Navigate with Tab, close modals with Escape
- **Works offline** — No internet connection required after initial load

### Subtasks
- **Checklist items** — Break down tasks into smaller subtasks
- **Completion tracking** — Toggle subtasks as done with visual progress (e.g., 2/5)
- **Inline editing** — Double-click to rename subtasks
- **Progress indicators** — Task cards show subtask completion status

### Subtask Reports
- **Per-subtask notes** — Add reports/notes to individual subtasks
- **Timestamps** — Each report shows when it was created
- **Expandable view** — Click to show/hide reports for each subtask

### Image Attachments
- **Drag and drop upload** — Drop images directly onto the upload zone
- **Click to upload** — Or use the traditional file picker
- **Image preview** — Click any image to view full-size in a modal
- **Format support** — JPEG, PNG, GIF, WebP (max 2MB per image)
- **Attachment indicators** — Task cards show image count

## Quick Start

```bash
# Clone the repository
git clone https://github.com/lovro-git/KanbanBoard.git
cd KanbanBoard

# Install dependencies
bun install

# Start development server
bun run dev
```

Open http://localhost:5173 in your browser.

## Build for Production

```bash
bun run build
```

The output will be in the `dist/` folder. You can serve it with any static file server or just open `index.html` directly.

## License

MIT
