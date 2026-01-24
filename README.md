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
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder. You can serve it with any static file server or just open `index.html` directly.

## Tech Stack

- React 18
- Vite
- @dnd-kit (drag and drop)
- Framer Motion (animations)
- CSS Modules

## Project Structure

```
src/
├── components/
│   ├── Board/              # Main board container with drag context
│   ├── Column/             # Individual column (To Do, In Progress, Done)
│   ├── Header/             # App header with theme toggle
│   ├── ImageGallery/       # Display uploaded images with preview
│   ├── ImageUpload/        # Drag-drop/click image upload zone
│   ├── Subtasks/           # Subtask list with add input
│   ├── SubtaskItem/        # Individual subtask with checkbox
│   ├── SubtaskReports/     # Reports list for a subtask
│   ├── TaskCard/           # Draggable task card
│   └── TaskModal/          # Modal for creating/editing tasks
├── context/
│   └── BoardContext.jsx    # Global state management
├── hooks/
│   └── useTheme.js         # Theme toggle hook
├── utils/
│   └── boardReducer.js     # State reducer with all actions
├── App.jsx
├── App.module.css
└── index.css               # Global styles and CSS variables
```

## Data Model

Tasks are stored in localStorage with the following structure:

```javascript
{
  id: 'task-xxx',
  title: string,
  description: string,
  createdAt: timestamp,
  reviews: [
    { id: 'review-xxx', content: string, createdAt: timestamp }
  ],
  subtasks: [
    {
      id: 'subtask-xxx',
      title: string,
      completed: boolean,
      createdAt: timestamp,
      reports: [
        { id: 'report-xxx', content: string, createdAt: timestamp }
      ]
    }
  ],
  images: [
    { id: 'img-xxx', name: string, data: string (base64), createdAt: timestamp }
  ]
}
```

## Privacy

Your data never leaves your browser. Everything is stored in localStorage — no servers, no cookies, no analytics. Clear your browser data and it's gone.

## Storage Considerations

Images are stored as base64 strings in localStorage. Keep in mind:

- localStorage has a ~5MB limit in most browsers
- Large images will consume storage quickly
- Images are compressed client-side before storage
- Consider periodically cleaning up unused attachments

## Limitations

This is a personal productivity tool, not a team collaboration platform. It does not support:

- Multiple users or sharing
- Multiple boards
- Syncing across devices
- Labels, due dates, or priorities
- Search or filtering

If you need those features, consider Trello, Jira, or similar services.

## License

MIT
